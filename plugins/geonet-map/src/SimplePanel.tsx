import React, { useState, useEffect, useCallback } from 'react';
import { PanelProps, DataFrameView } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { useStyles2 } from '@grafana/ui';
import { TileLayer, MapContainer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { getDashboard, addPanel } from 'update';
import 'leaflet/dist/leaflet.css';
import './map.css';
import L from 'leaflet';

let DefaultIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props extends PanelProps<SimpleOptions> {}

interface Positions {
  [key: string]: L.LatLng;
}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  const frame = data.series[0];
  const view = new DataFrameView(frame);

  const [markers, setMarkers] = useState<Array<JSX.Element | undefined>>([]);
  const [markerPositions, setMarkerPositions] = useState({}); // Key: station, Value: L.LatLng

  // Make markers when data changes.
  useEffect(() => {
    // Store marker positions. TODO: probably a better way of doing this (ie: getting position from markers)
    let positions: Positions = {};

    const m = view.map((row, index) => {
      if (row['key'] && row['lat'] && row['lon']) {
        const { key: station, lat, lon } = row;

        // Save marker position
        const markerPos = new L.LatLng(lat, lon);
        positions[station] = markerPos;

        const markerProps = {
          position: { lat: lat, lng: lon },
          eventHandlers: {
            click: () => {
              console.log('marker clicked');
            },
          },
          isOpen: true,
        };

        return (
          <Marker {...markerProps} key={index}>
            <Popup>
              {station}
              <br />
              <button
                onClick={() => {
                  // TODO: add error handling.
                  getDashboard().then((db) => {
                    addPanel(db, 'tilde-data', station);
                  });
                }}
              >
                {station}
              </button>
            </Popup>
          </Marker>
        );
      }
      return;
    });
    setMarkers(m);
    setMarkerPositions(positions);
  }, [data]);

  /* Weird Leaflet bug only in Safari, clicking marker doesn't open popup, but long click does.
  Fix (for now, not sure what happens if using touchscreen) is to set MapContainer attribute 'tap' to 'false'.
  See: https://github.com/Leaflet/Leaflet/issues/7255#issuecomment-852963030 */

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <MapContainer center={[-41, 174]} zoom={4} scrollWheelZoom={false} tap={false}>
        <TileLayer url="https://static.geonet.org.nz/osm/v3/{z}/{x}/{y}.png" />
        <AreaSelector mPositions={markerPositions} />
        {markers}
      </MapContainer>
    </div>
  );
};

const getStyles = () => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
};

type AreaSelectorProps = {
  mPositions: Positions;
};

function AreaSelector({ mPositions }: AreaSelectorProps) {
  const [startPoint, setStartPoint] = useState<L.LatLng | null>();

  const onMouseDown = useCallback((e: L.LeafletMouseEvent) => {
    if (e.originalEvent.shiftKey) {
      // check if the shift key been pressed
      setStartPoint(e.latlng);
    }
  }, []);

  const onMouseUp = useCallback(
    (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();

      if (e.originalEvent.shiftKey && startPoint) {
        const bounds = new L.LatLngBounds(startPoint, e.latlng);
        const selectedIds: string[] = [];

        for (let station in mPositions) {
          const point = mPositions[station];
          bounds.contains(point) && selectedIds.push(station);
        }
        console.log('Selected: ', selectedIds);

        const dashboard = getDashboard();

        for (let m of selectedIds) {
          // TODO: add error handling.
          dashboard.then((db) => {
            addPanel(db, 'tilde-data', m);
          });
        }
        setStartPoint(null);
      }
    },
    [mPositions, startPoint]
  );

  useMapEvents({
    mousedown: onMouseDown,
    mouseup: onMouseUp,
  });

  return null;
}
