/* global describe, it, before */
import {fetch} from '../src/marker/fetch';
import {expect} from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Given fetch', () => {
    it('should return markers', async () => {
        const response = {
            metaData: {
                description: 'this is my description',
                icon: '',
                link: {
                    title: 'a new link',
                    url: 'https://cdn3.iconfinder.com/data/icons/pyconic-icons-1-2/512/location-pin-512.png'
                },
                pin: 'https://cdn3.iconfinder.com/data/icons/pyconic-icons-1-2/512/location-pin-512.png',
                publishedDate: 'Fri, 10 Jul 2020 03:16:38 GMT',
                title: 'my map',
                viewCount: 2
            },
            markers: [
                {
                    addInfo: 'this is extra info',
                    data: {
                        range: {
                            end: '2007',
                            start: ''
                        }
                    },
                    location: {
                        lat: '55.028384968958534',
                        long: '-7.3250261840820485',
                        city: 'Londonderry',
                        country: ' UK',
                        state: ''
                    },
                    icon: '',
                    id: '-L-_1r-tDFI2f9c15cIf',
                    name: 'mikem edit',
                    pin: '',
                    link: {
                        title: '',
                        url: ''
                    }
                },
                {
                    addInfo: '',
                    data: {value: '2015'},
                    icon: '',
                    id: '-L-sQUm9WsH_ltmpzdpS',
                    location: {
                        lat: '47.6062095',
                        long: '-122.3320708',
                        city: 'Seattle',
                        country: 'USA',
                        state: 'WA'
                    },
                    name: 'sloam',
                    pin: '',
                    link: {
                        title: '',
                        url: ''
                    }
                },
                {
                    addInfo: 'This is additional info',
                    data: {
                        range: {
                            end: '2000',
                            start: '1989'
                        }
                    },
                    location: {
                        lat: '42.361145',
                        long: '-71.057083',
                        city: 'Boston',
                        country: 'USA',
                        state: 'MA'
                    },
                    icon: 'https://avatars2.githubusercontent.com/u/5161038?s=88&v=4',
                    id: '-L1zTFMQs27I2rh3d1i3',
                    name: 'Mike Boston',
                    pin: '',
                    link: {
                        title: 'website',
                        url: 'http://www.espn.com'
                    }
                }
            ]
        };

        var mock = new MockAdapter(axios);
        mock.onGet(
            'https://us-central1-mapsforall-96ddd.cloudfunctions.net/getPublishedMap?mapId=1512409330904&incrementViewCount=false'
        ).reply(200, response);

        const markers = await fetch('1512409330904', false);
        expect(markers).to.not.be.empty;
    });
});
