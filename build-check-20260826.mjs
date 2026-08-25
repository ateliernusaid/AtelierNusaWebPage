// Build check via vite CLI
import { execSync } from 'child_process';
try {
  const out = execSync('npx vite build', { encoding: 'utf8', timeout: 180000 });
  console.log(out.slice(-900));
} catch (e) {
  console.log('BUILD FAILED:');
  console.log((e.stdout || '').slice(-1500));
  console.log((e.stderr || '').slice(-800));
  process.exit(1);
}