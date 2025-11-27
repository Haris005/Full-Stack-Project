const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const dataSourcesPath = path.join(__dirname, '../../data');

function normalizeData(sources) {
  let totalInTonnes = 0;
  const processedSources = [];

  sources.forEach(source => {
    let valueInTonnes = 0;
    const data = source.data;

    for (const key in data) {
      const lowerKey = key.toLowerCase();
      const value = parseFloat(data[key]);

      if (lowerKey.includes('scope') && lowerKey.includes('1')) {
        if (lowerKey.includes('kg') || data[key].toString().includes('kg')) {
          valueInTonnes = value / 1000;
        } else if (lowerKey.includes('tonne') || lowerKey.includes('ton') || lowerKey.includes('mt')) {
          valueInTonnes = value;
        } else {
          valueInTonnes = value;
        }
      } else if (lowerKey.includes('carbon') || lowerKey.includes('co2') || lowerKey.includes('emission')) {
        if (lowerKey.includes('kg') || data[key].toString().includes('kg')) {
          valueInTonnes = value / 1000;
        } else if (lowerKey.includes('tonne') || lowerKey.includes('ton') || lowerKey.includes('mt')) {
          valueInTonnes = value;
        } else {
          valueInTonnes = value;
        }
      }
    }

    totalInTonnes += valueInTonnes;
    processedSources.push(source.name);
  });

  return {
    metric: 'Scope 1 Emissions',
    value_tonnes: Math.round(totalInTonnes * 100) / 100,
    source_count: sources.length,
    sources: processedSources,
    timestamp: new Date().toISOString()
  };
}

async function syncData(req, res, next) {
  try {
    const sourceA = JSON.parse(fs.readFileSync(path.join(dataSourcesPath, 'source_a.json'), 'utf8'));
    const sourceB = JSON.parse(fs.readFileSync(path.join(dataSourcesPath, 'source_b.json'), 'utf8'));
    const sourceC = JSON.parse(fs.readFileSync(path.join(dataSourcesPath, 'source_c.json'), 'utf8'));

    const sources = [
      { name: 'Source A', data: sourceA },
      { name: 'Source B', data: sourceB },
      { name: 'Source C', data: sourceC }
    ];

    const normalizedData = normalizeData(sources);

    const insertQuery = `
      INSERT INTO sustainability_data
      (metric, value_tonnes, source_count, sources, timestamp)
      VALUES
      (:metric, :value_tonnes, :source_count, :sources, TO_TIMESTAMP(:timestamp, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'))
    `;

    await db.execute(insertQuery, {
      metric: normalizedData.metric,
      value_tonnes: normalizedData.value_tonnes,
      source_count: normalizedData.source_count,
      sources: normalizedData.sources.join(','),
      timestamp: normalizedData.timestamp
    });

    res.json({
      success: true,
      message: `Synced ${normalizedData.source_count} sources`,
      data: normalizedData
    });
  } catch (error) {
    next(error);
  }
}

async function getAllData(req, res, next) {
  try {
    const query = `
      SELECT
        metric,
        value_tonnes,
        source_count,
        sources,
        TO_CHAR(timestamp, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') as timestamp
      FROM sustainability_data
      ORDER BY timestamp DESC
    `;

    const result = await db.execute(query);

    const formattedData = result.rows.map(row => ({
      metric: row.METRIC,
      value_tonnes: row.VALUE_TONNES,
      source_count: row.SOURCE_COUNT,
      sources: row.SOURCES.split(','),
      timestamp: row.TIMESTAMP
    }));

    res.json(formattedData);
  } catch (error) {
    next(error);
  }
}

async function getLatestData(req, res, next) {
  try {
    const query = `
      SELECT
        metric,
        value_tonnes,
        source_count,
        sources,
        TO_CHAR(timestamp, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') as timestamp
      FROM sustainability_data
      ORDER BY timestamp DESC
      FETCH FIRST 1 ROW ONLY
    `;

    const result = await db.execute(query);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data found'
      });
    }

    const row = result.rows[0];
    const data = {
      metric: row.METRIC,
      value_tonnes: row.VALUE_TONNES,
      source_count: row.SOURCE_COUNT,
      sources: row.SOURCES.split(','),
      timestamp: row.TIMESTAMP
    };

    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  syncData,
  getAllData,
  getLatestData
};

