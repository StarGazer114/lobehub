const { execSync } = require('node:child_process');

module.exports = {
  // Runs after @netlify/plugin-nextjs onBuild, i.e. once the server handler
  // bundle exists, but before the deploy/upload stage that enforces the
  // 250 MB function size limit.
  onSuccess: async () => {
    const dir = '.netlify/functions-internal/___netlify-server-handler';
    try {
      const total = execSync(`du -sh ${dir} && du -sh ${dir}/* | sort -h && du -sh ${dir}/node_modules/.pnpm/* | sort -h | tail -45`, {
        encoding: 'utf8',
        shell: '/bin/bash',
      });
      console.log(`SIZE_REPORT_START\n${total}\nSIZE_REPORT_END`);
    } catch (error) {
      console.log(`SIZE_REPORT_FAILED ${error.message}`);
    }
  },
};
