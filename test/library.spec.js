/* global describe, it, before */
import chai from 'chai';
import {TimeLineMap} from '../dist/TimeLineMap.js';
import {JSDOM} from 'jsdom';
chai.expect();

const expect = chai.expect;

describe('Given a TimeLineMap', () => {
    it('should be a class/constructor(function)', () => {
        expect(TimeLineMap).to.be.an('function');
    });

    // it('should mount google maps and slider', done => {
    //     getDomWithGoogleApi().then(dom => {
    //         global.window = dom.window;
    //         global.document = dom.window.document;
    //         global.google = dom.window.google;

    //         const map = new TimeLineMap('1512409330904', 'mapControlId', 'dateControlId');
    //         map.create();
    //         setTimeout(() => {
    //             console.log(window.document.documentElement.outerHTML);
    //             expect(dom.window.document.getElementById('mapControlId').children).to.have.lengthOf(1);
    //             expect(dom.window.document.getElementById('dateControlId').children).to.have.lengthOf(2);
    //             done();
    //         }, 1500);
    //     });
    // });
});

const getDomWithGoogleApi = () =>
    new Promise(res => {
        const dom = new JSDOM(
            `
      <!doctype html>
      <html>
          <head>
              <script src="https://maps.googleapis.com/maps/api/js?v=3.32&key=AIzaSyDcRzhgDwvAiAcXKvDnXhczwOrKNCHhKS0&libraries=places&callback=googleReady"></script>
              <body>
                <div id="mapControlId"></div>
                <div id="dateControlId"></div>
              </body>
          </head>
      </html>`,
            {runScripts: 'dangerously', resources: 'usable'}
        );

        dom.window.googleReady = () => {
            res(dom);
        };
    });
