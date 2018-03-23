'use strict';

const checkArea = require('../../top-airports/top-airports');
require('jest');

let data = [ { destination: 'DEN',
  departure_date: '2018-04-17',
  return_date: '2018-04-19',
  price: '88.60',
  airline: 'UA' },
{ destination: 'ICN',
  departure_date: '2018-04-17',
  return_date: '2018-04-19',
  price: '188.60',
  airline: 'UA' },
{ destination: 'LHR',
  departure_date: '2018-04-17',
  return_date: '2018-04-19',
  price: '288.60',
  airline: 'UA' } ];

let usaAnswer = [ { destination: 'DEN',
  departure_date: '2018-04-17',
  return_date: '2018-04-19',
  price: '88.60',
  airline: 'UA' }];

let euAnswer = [ { destination: 'LHR',
  departure_date: '2018-04-17',
  return_date: '2018-04-19',
  price: '288.60',
  airline: 'UA' }];

let asiaAnswer = [ { destination: 'ICN',
  departure_date: '2018-04-17',
  return_date: '2018-04-19',
  price: '188.60',
  airline: 'UA' }];

describe('Check checkArea fucntion', function () {

  describe('Valid Requests', () => {
    it('should return only US airports', () => {
      expect(checkArea.checkAirport(data, 'usa')).toEqual(usaAnswer);
    });
    it('should return only EU airports', () => {
      expect(checkArea.checkAirport(data, 'eu')).toEqual(euAnswer);
    });
    it('should return only ASIA airports', () => {
      expect(checkArea.checkAirport(data, 'asia')).toEqual(asiaAnswer);
    });
    it('should return only ALL airports', () => {
      expect(checkArea.checkAirport(data, 'all')).toEqual(data);
    });
  });

  describe('Invalid Requests', () => {
    it('should return only ALL airports if invaild input', () => {
      expect(checkArea.checkAirport(data, 'test')).toEqual(data);
    });
  });

});
