import updateNotifier from 'update-notifier';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
export function checkUpdate() {
    const notifier = updateNotifier({
        pkg: packageJson,
        updateCheckInterval: 1000 * 60 * 60 * 24, // 24 hours
    });
    if (notifier.update) {
        notifier.notify({
            message: `Update available: ${notifier.update.latest}`,
        });
    }
}
//# sourceMappingURL=update-notifier.js.map