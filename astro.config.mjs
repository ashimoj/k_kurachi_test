import { defineConfig } from "astro/config";
import sassGlobImports from "vite-plugin-sass-glob-import";
import relativeLinks from "astro-relative-links";
import htmlBeautifier from "astro-html-beautifier";
import chokidar from "chokidar";
import sharp from "sharp";

import fsp from "fs/promises";
import path from "path";

const ASSETS_DIR = "assets";

export default defineConfig({
    base: "",
    output: "static",
    publicDir: "public",
    server: { open: true, host: true, port: 80 },
    build: {
        inlineStylesheets: "never",
    },

    vite: {
        plugins: [sassGlobImports()],
        build: {
            outDir: "dist",
            assetsDir: ASSETS_DIR,
            assetsInlineLimit: 0,
            cssCodeSplit: false,

            // ▼ JS の minify を無効化
            // minify: false,
            // ▼ CSS の minify を無効化
            // cssMinify: false,

            rollupOptions: {
                output: {
                    // JS
                    entryFileNames: `${ASSETS_DIR}/js/main.js`,

                    // 画像/フォント/CSS など
                    assetFileNames: (assetInfo) => {
                        const sourceName = assetInfo.names?.[0] || assetInfo.fileName;
                        const ext = sourceName.split(".").pop()?.toLowerCase() || "";

                        if (/^(ttf|otf|eot|woff2?)$/.test(ext)) {
                            return `${ASSETS_DIR}/webfonts/[name][extname]`;
                        }
                        if (/^(png|webp|avif|jpe?g|svg|gif|tiff|bmp|ico)$/.test(ext)) {
                            return `${ASSETS_DIR}/images/[name][extname]`;
                        }
                        if (ext === "css") {
                            return `${ASSETS_DIR}/css/style[extname]`;
                        }
                        return `${ASSETS_DIR}/misc/[name][extname]`;
                    },
                },
            },
        },
    },

    integrations: [
        relativeLinks(),
        // htmlBeautifier(),
        OptimizeImages(),
    ],
});

/** ====== コンフィグ ====== */
const SRC_ROOT = path.resolve("src/assets/images");
const DEST_ROOT = path.resolve("public/assets/images");

/** ====== ユーティリティ ====== */
const posix = (p) => p.replace(/\\/g, "/");
const ensureDir = async (p) => {
    await fsp.mkdir(p, { recursive: true }).catch(() => {});
};
const statSafe = async (p) => {
    try {
        return await fsp.stat(p);
    } catch {
        return null;
    }
};
const rmIf = async (p) => {
    try {
        await fsp.rm(p, { force: true });
    } catch {}
};

const destPathOf = (srcAbs) => {
    const rel = path.relative(SRC_ROOT, path.resolve(srcAbs));
    return path.resolve(DEST_ROOT, rel);
};

const withExt = (filePath, ext) => path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + ext);

const isJpgPng = (ext) => /^(jpe?g|png)$/i.test(ext.replace(/^\./, ""));
const isDerived = (name) => name.endsWith(".webp") || name.endsWith(".avif");

const cleanEmptyDirsUp = async (startDir, stopAt) => {
    let cur = startDir,
        stop = path.resolve(stopAt);
    while (path.resolve(cur).startsWith(stop)) {
        try {
            const items = await fsp.readdir(cur);
            if (items.length === 0) {
                await fsp.rmdir(cur);
                cur = path.dirname(cur);
                if (path.resolve(cur) === stop) break;
            } else break;
        } catch {
            break;
        }
    }
};

/** ====== ファイル生成/更新 ====== */
const buildOne = async (srcAbs) => {
    const src = path.resolve(srcAbs);
    const dst = destPathOf(src);
    const dstDir = path.dirname(dst);
    await ensureDir(dstDir);

    const srcSt = await statSafe(src);
    if (!srcSt || !srcSt.isFile()) return;

    const ext = path.extname(src).toLowerCase();
    const dstSt = await statSafe(dst);
    if (dstSt && dstSt.mtimeMs >= srcSt.mtimeMs) return;

    if (isJpgPng(ext)) {
        if (/jpe?g/.test(ext)) await sharp(src).jpeg({ quality: 90 }).toFile(dst);
        else await sharp(src).png({ quality: 95 }).toFile(dst);

        await sharp(src).webp({ quality: 90 }).toFile(withExt(dst, ".webp"));
        await sharp(src).avif({ quality: 90 }).toFile(withExt(dst, ".avif"));
    } else {
        await fsp.copyFile(src, dst);
    }
};

/** ====== ファイル削除 ====== */
const removeOne = async (srcPathFromEvent) => {
    const srcAbs = path.isAbsolute(srcPathFromEvent) ? srcPathFromEvent : path.resolve(srcPathFromEvent);

    const dst = destPathOf(srcAbs);
    const dstDir = path.dirname(dst);
    const base = path.basename(dst);

    await rmIf(dst);
    if (!isDerived(base)) {
        await rmIf(withExt(dst, ".webp"));
        await rmIf(withExt(dst, ".avif"));
    }
    await cleanEmptyDirsUp(dstDir, DEST_ROOT);
};

/** ====== 同期処理 ====== */
const walkFiles = async (dir, onFile) => {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
        const abs = path.join(dir, e.name);
        if (e.isDirectory()) await walkFiles(abs, onFile);
        else if (e.isFile()) await onFile(abs);
    }
};

const fullSync = async () => {
    await ensureDir(DEST_ROOT);

    await walkFiles(SRC_ROOT, async (abs) => {
        await buildOne(abs);
    });

    const prune = async (dir) => {
        const entries = await fsp.readdir(dir, { withFileTypes: true });
        for (const e of entries) {
            const abs = path.join(dir, e.name);
            if (e.isDirectory()) {
                await prune(abs);
                await cleanEmptyDirsUp(abs, DEST_ROOT);
            } else {
                const base = path.basename(abs);
                if (isDerived(base)) continue;
                const rel = path.relative(DEST_ROOT, abs);
                const srcCandidate = path.join(SRC_ROOT, rel);
                const exists = await statSafe(srcCandidate);
                if (!exists) {
                    await rmIf(abs);
                    await rmIf(withExt(abs, ".webp"));
                    await rmIf(withExt(abs, ".avif"));
                }
            }
        }
    };
    await prune(DEST_ROOT);
};

/** ====== 監視 ====== */
let watcher = null;
let renameDebounceTimer = null;

const startWatch = () => {
    if (watcher) return watcher;

    watcher = chokidar.watch(SRC_ROOT, {
        persistent: true,
        ignoreInitial: false,
        interval: 100,
        binaryInterval: 300,
        followSymlinks: true,
        alwaysStat: true,
        depth: Infinity,
        ignorePermissionErrors: true,
    });

    fullSync().catch(console.error);

    watcher
        .on("all", (event, p) => {
            const abs = path.resolve(p);
            const nice = `[all] ${event.padEnd(7)}: ${posix(p)}`;
            if (event === "add" || event === "change") {
                buildOne(abs);
            } else if (event === "unlink") {
                removeOne(abs);
            } else if (event === "addDir") {
                ensureDir(path.resolve(DEST_ROOT, path.relative(SRC_ROOT, abs)));
            } else if (event === "unlinkDir") {
                const dest = path.resolve(DEST_ROOT, path.relative(SRC_ROOT, abs));
                rmIf(dest).then(() => cleanEmptyDirsUp(path.dirname(dest), DEST_ROOT));
            }
        })
        .on("raw", (ev, p, details) => {
            if (ev && /rename|change/i.test(ev)) {
                clearTimeout(renameDebounceTimer);
                renameDebounceTimer = setTimeout(() => {
                    fullSync().catch(console.error);
                }, 250);
            }
        })
        .on("error", (err) => console.error("[watch] error:", err));

    return watcher;
};

const stopWatch = async () => {
    if (!watcher) return;
    try {
        await watcher.close();
    } finally {
        watcher = null;
    }
};

/** ====== 実行部 ====== */
export function OptimizeImages() {
    return {
        name: "optimize-images-mirror",
        hooks: {
            "astro:server:setup": ({ server }) => {
                startWatch();
                server.httpServer?.on("close", () => {
                    stopWatch();
                });
            },
            "astro:server:done": async () => {
                await stopWatch();
            },
            "astro:build:start": async () => {
                await fullSync();
            },
        },
    };
}
