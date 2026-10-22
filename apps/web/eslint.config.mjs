import {defineConfig} from 'eslint/config';
import next from 'eslint-config-next/core-web-vitals';
export default defineConfig([...next,{ignores:['out/**','.next/**','next-env.d.ts']}]);