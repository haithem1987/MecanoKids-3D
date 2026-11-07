import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(project, 'dist');
const wrangler = path.join(project, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const temporaryRoot = await realpath(tmpdir());
const release = await mkdtemp(path.join(temporaryRoot, 'octoglos-release-'));

try {
  await cp(dist, release, {
    recursive: true,
    filter: source => !['wrangler.json', '.assetsignore'].includes(path.relative(dist, source)),
  });
  const deployment = spawnSync(process.execPath, [
    wrangler, 'pages', 'deploy', release, '--project-name', 'octoglos', '--branch', 'main',
  ], { cwd: release, stdio: 'inherit' });
  if (deployment.error) throw deployment.error;
  process.exitCode = deployment.status ?? 1;
} finally {
  const resolvedRelease = await realpath(release);
  if (path.dirname(resolvedRelease) === temporaryRoot && path.basename(resolvedRelease).startsWith('octoglos-release-')) {
    await rm(resolvedRelease, { recursive: true });
  }
}
