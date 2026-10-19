const { execSync } = require('node:child_process');

const report = () => {
  const dir = '.netlify/functions-internal/___netlify-server-handler';
  try {
    const total = execSync(
      `du -sh ${dir}; du -sh ${dir}/* | sort -h; du -sh ${dir}/node_modules/.pnpm/* | sort -h | tail -45`,
      { encoding: 'utf8', shell: '/bin/bash' },
    );
    console.log(`SIZE_REPORT_START\n${total}\nSIZE_REPORT_END`);
  } catch (error) {
    console.log(`SIZE_REPORT_FAILED ${error.message}`);
  }
};

module.exports = {
  // onEnd always runs, even when the deploy stage later rejects the function
  // for exceeding the 250 MB limit, which is exactly when we need the numbers.
  onEnd: async () => report(),
  onSuccess: async () => report(),
};
