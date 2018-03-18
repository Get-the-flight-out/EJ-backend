'use strict';

let usAirPorts = ['ATL', 'LAX', 'ORD', 'DFW', 'JFK', 'DEN', 'SFO', 'LAS', 'CLT', 'SEA', 'PHX', 'MIA', 'MCO', 'IAH', 'EWR', 'MSP', 'BOS', 'DTW', 'PHL', 'LGA', 'FLL', 'BWI', 'DCA', 'SLC', 'MDW', 'IAD', 'SAN', 'HNL', 'TPA', 'PDX'];

let asiaAirPorts = ['SIN', 'HND', 'HKG', 'ICN', 'KUL', 'NRT', 'PEK', 'KIX', 'CGK', 'TPE', 'BBK', 'MNK', 'CAN', 'DEL', 'BOM', 'DXB', 'PVG', 'HAN', 'BLG', 'SGN', 'CRK', 'KHI', 'DPS', 'JED', 'DMK', 'SHA', 'CTU', 'MAA', 'AUH', 'DOH','SUB', 'SZX', 'HYD', 'DVO', 'KTM', 'CKG', 'XIY', 'CJU', 'IST', 'RUN', 'NKG','LHE', 'GMP', 'ISB', 'DAC', 'KHH', 'CSK', 'THR', 'JHB', 'NGO'];

let euAirPorts = ['LHR', 'AMS', 'CDG', 'FRA', 'BCN', 'ZRH', 'LGW', 'MUC', 'FCO', 'MAD', 'OSL', 'BRU', 'ARN', 'CPH', 'ATH', 'JER', 'MXP', 'TXL', 'STN', 'NCE', 'IST', 'VIE', 'HEL', 'WAW', 'ORY', 'GVA', 'TLS', 'GLA', 'CGN', 'EDI','DUB', 'LTN', 'PRG', 'LIS', 'LYS', 'SXF', 'GIB', 'KEF', 'ALC', 'MAN', 'LCY','DUS', 'AGP', 'BHX', 'HAM', 'STR', 'BFS', 'SVO', 'BUD', 'BSL', 'CTA'];

module.exports = new class {
  checkAirport(arr, location) {
    let areaToSeach;

    if (location.toString().toLowerCase() === 'usa') {
      areaToSeach = usAirPorts;
    }
    if (location.toString().toLowerCase() === 'eu') {
      areaToSeach = euAirPorts;
    }
    if (location.toString().toLowerCase() === 'asia') {
      areaToSeach = asiaAirPorts;
    }

    let final = [];
    for (let y in arr) {
      for (let i in areaToSeach) {
        if(areaToSeach[i] === arr[y].destination.toString()) {
          final.push(arr[y]);
        }
      }
    }
    return final;
  }
};