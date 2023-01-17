import { DashboardData, GridPos, PanelsEntity, TargetsEntity } from './dashboard-types';

// Functions to update the dashboard that this geonet-map panel exists in.

// datasource: tilde-data
// id: 6

const username = 'admin';
const password = '-pl,0okm9ijn';
const dashboardId = 'w_uRZWOnz';

// curl -X GET -H "Accept: application/json" -H "Content-Type: application/json" http://admin:-pl,0okm9ijn@localhost:3000/api/dashboards/uid/w_uRZWOnz

function getDashboard(): Promise<DashboardData> {
  const url = `http://localhost:3000/api/dashboards/uid/${dashboardId}`;

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));

  return fetch(url, {
    method: 'GET',
    headers: requestHeaders,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<DashboardData>;
  });
}

function addPanel(db: DashboardData, datasource: string, station: string) {
  const panelId = getNextPanelId(db);
  const panelPos = getNextPanelPos(db);

  const target = {
    // TODO: At the moment just choosing station.
    domain: 'dart',
    name: 'water-height',
    refId: 'A',
    sensorCode: '40',
    station: station,
    type: 'WTZ',
  };

  console.log('new panel id: ', panelId);

  const panel = createPanel(datasource, panelId, target, panelPos);
  db.dashboard.panels?.push(panel);

  const url = `http://localhost:3000/api/dashboards/db`;
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));

  // POST body
  const body = {
    dashboard: db.dashboard,
    folderId: db.meta.folderId,
    folderUid: db.meta.folderUid,
    message: 'Added panel for ' + station,
    overwrite: true,
  };

  fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(body),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    console.log('Successfully added panel for ', station);
  });
}

function getNextPanelId(db: DashboardData): number {
  let maxId = 0;

  const panels = db.dashboard.panels;
  if (!panels) {
    return maxId;
  }
  for (let p of panels) {
    console.log('existing panel id: ', p.id);
    if (p.id > maxId) {
      maxId = p.id;
    }
  }
  return ++maxId;
}

// TODO: At the moment just adds to right column of dashboard.
// There's probably a better way of doing this...
function getNextPanelPos(db: DashboardData): GridPos {
  let position: GridPos = {
    h: 8,
    w: 12,
    x: 12,
    y: 0,
  };
  const panels = db.dashboard.panels;
  if (!panels) {
    return position;
  }

  let nextYPosition = 0;
  for (let p of panels) {
    const { h, x } = p.gridPos;
    if (x > 0) {
      // is in second column
      nextYPosition += h;
    }
  }
  position.y = nextYPosition;
  console.log('returning gridPos: ', position);
  return position;
}

// @ts-ignore
function createPanel(datasource: string, id: number, target: TargetsEntity, pos: GridPos): PanelsEntity {
  const panel = {
    datasource: datasource,
    fieldConfig: {
      defaults: {
        color: {
          mode: 'palette-classic',
        },
        custom: {
          axisLabel: '',
          axisPlacement: 'auto',
          barAlignment: 0,
          drawStyle: 'line',
          fillOpacity: 0,
          gradientMode: 'none',
          hideFrom: {
            legend: false,
            tooltip: false,
            viz: false,
          },
          lineInterpolation: 'linear',
          lineWidth: 1,
          pointSize: 5,
          scaleDistribution: {
            type: 'linear',
          },
          showPoints: 'auto',
          spanNulls: false,
          stacking: {
            group: 'A',
            mode: 'none',
          },
          thresholdsStyle: {
            mode: 'off',
          },
        },
        mappings: [],
        thresholds: {
          mode: 'absolute',
          steps: [
            {
              color: 'green',
              value: null,
            },
            {
              color: 'red',
              value: 80,
            },
          ],
        },
      },
      overrides: [],
    },
    gridPos: pos,
    id: id,
    options: {
      legend: {
        calcs: [],
        displayMode: 'list',
        placement: 'bottom',
      },
      tooltip: {
        mode: 'single',
      },
    },
    targets: [target],
    title: `DART_${target.station}_water-height_40_WTZ`,
    type: 'timeseries',
  };

  return panel;
}

export { getDashboard, addPanel };
