var pmx = require('pmx');

module.exports = function refreshBackendMetrics(metrics, pgClient) {
  var queryString = "SELECT count(*) - ( SELECT count(*) FROM pg_stat_activity WHERE"
    + " state = 'idle' ) AS backends_active, ( SELECT count(*) FROM"
    + " pg_stat_activity WHERE state = 'idle' ) AS backends_idle"
    + " FROM pg_stat_activity;";
  pgClient.query(queryString, function (err, rows) {
    if (err) {
      return pmx.notify("Backend Query Error: " + err);
    }

    // Backends Active
    metrics.backendsActive.set(rows[0].backends_active);

    // Backends Idle
    metrics.backendsIdle.set(rows[0].backends_idle);
  });
};
