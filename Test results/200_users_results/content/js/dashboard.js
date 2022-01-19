/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.75, "KoPercent": 0.25};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.884375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ConfirmationPage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 3"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 3"], "isController": false}, {"data": [0.55, 500, 1500, "HomePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 4"], "isController": false}, {"data": [0.525, 500, 1500, "HomePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 1"], "isController": false}, {"data": [0.525, 500, 1500, "HomePage 3"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 2"], "isController": false}, {"data": [0.55, 500, 1500, "HomePage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 3"], "isController": false}, {"data": [0.5375, 500, 1500, "HomePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 800, 2, 0.25, 385.34124999999943, 291, 1502, 333.0, 558.0, 581.0, 754.8500000000001, 17.63279700242451, 26.820792924840205, 10.682995371390787], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ConfirmationPage 4", 40, 0, 0.0, 325.57499999999993, 296, 448, 317.5, 351.9, 375.65, 448.0, 1.4035580195796344, 2.0900198800835117, 1.040332555528264], "isController": false}, {"data": ["ConfirmationPage 5", 40, 0, 0.0, 321.37499999999994, 298, 385, 317.5, 341.0, 345.0, 385.0, 1.6668055671305941, 2.4807568599466623, 1.2387099966663888], "isController": false}, {"data": ["ReservePage 5", 40, 0, 0.0, 318.325, 294, 363, 312.5, 344.0, 346.0, 363.0, 3.3383408446002334, 4.962114395551661, 2.0017004673677183], "isController": false}, {"data": ["PurchasePage 1", 40, 0, 0.0, 325.55000000000007, 294, 405, 326.5, 354.5, 357.9, 405.0, 1.563721657544957, 2.662564442435497, 1.0292464816262705], "isController": false}, {"data": ["ConfirmationPage 2", 40, 0, 0.0, 328.225, 303, 349, 331.5, 346.9, 347.95, 349.0, 1.4215651432226881, 2.130681818181818, 1.0536796325254103], "isController": false}, {"data": ["ConfirmationPage 3", 40, 0, 0.0, 327.72499999999997, 300, 416, 325.5, 351.7, 358.79999999999995, 416.0, 1.716811880338212, 2.575385477917507, 1.287608910253659], "isController": false}, {"data": ["PurchasePage 3", 40, 0, 0.0, 326.55000000000007, 294, 371, 321.0, 360.79999999999995, 369.79999999999995, 371.0, 1.9221528111484865, 3.281081060788083, 1.250150168188371], "isController": false}, {"data": ["HomePage 1", 40, 0, 0.0, 553.65, 496, 1050, 541.0, 589.3, 619.0, 1050.0, 3.124023742580444, 4.383319543697282, 1.3911668228678538], "isController": false}, {"data": ["PurchasePage 2", 40, 0, 0.0, 331.70000000000005, 303, 398, 333.5, 350.9, 365.59999999999997, 398.0, 1.7550017550017551, 3.003855176706739, 1.1568615084240084], "isController": false}, {"data": ["ConfirmationPage 1", 40, 0, 0.0, 330.34999999999997, 300, 498, 328.5, 347.6, 368.4, 498.0, 1.6079109217349359, 2.4301595097881576, 1.1902309362061343], "isController": false}, {"data": ["PurchasePage 5", 40, 0, 0.0, 320.4749999999999, 295, 365, 320.5, 337.9, 348.9, 365.0, 2.101061035823091, 3.5679053078054417, 1.3829249395944951], "isController": false}, {"data": ["PurchasePage 4", 40, 0, 0.0, 331.45000000000005, 299, 431, 329.0, 358.7, 400.75, 431.0, 1.564394383824162, 2.63464485803121, 1.0220506277132466], "isController": false}, {"data": ["HomePage 2", 40, 1, 2.5, 601.175, 495, 1502, 559.0, 735.6999999999999, 905.0999999999993, 1502.0, 2.2785531187695813, 3.2239635253489034, 0.9568142979208203], "isController": false}, {"data": ["ReservePage 1", 40, 0, 0.0, 321.09999999999997, 293, 384, 322.5, 344.9, 361.54999999999995, 384.0, 2.389200812328276, 3.5366704993429696, 1.4372536136662286], "isController": false}, {"data": ["HomePage 3", 40, 0, 0.0, 569.4499999999999, 497, 1281, 538.5, 598.5, 931.5999999999985, 1281.0, 3.5964754540550263, 5.037524163819457, 1.5102387160582629], "isController": false}, {"data": ["ReservePage 2", 40, 0, 0.0, 324.8499999999999, 291, 366, 327.5, 345.8, 364.29999999999995, 366.0, 2.042900919305414, 3.0592142013534223, 1.2269375638406539], "isController": false}, {"data": ["HomePage 4", 40, 1, 2.5, 564.325, 489, 1502, 525.5, 605.5, 623.4499999999999, 1502.0, 2.3618327822390173, 3.3158494663734057, 0.9917852503542749], "isController": false}, {"data": ["ReservePage 3", 40, 0, 0.0, 322.725, 293, 360, 324.5, 348.7, 358.84999999999997, 360.0, 2.406883687345809, 3.543983448913894, 1.436138606414345], "isController": false}, {"data": ["HomePage 5", 40, 0, 0.0, 545.2750000000001, 492, 757, 539.0, 589.7, 617.15, 757.0, 3.026405387001589, 4.220047453090716, 1.2708538246198078], "isController": false}, {"data": ["ReservePage 4", 40, 0, 0.0, 316.97499999999997, 292, 364, 316.0, 335.9, 352.34999999999997, 364.0, 1.944012441679627, 2.870455870917574, 1.163749635497667], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,502 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, 100.0, 0.25], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 800, 2, "The operation lasted too long: It took 1,502 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HomePage 2", 40, 1, "The operation lasted too long: It took 1,502 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HomePage 4", 40, 1, "The operation lasted too long: It took 1,502 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
