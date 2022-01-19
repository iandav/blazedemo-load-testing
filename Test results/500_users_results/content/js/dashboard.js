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

    var data = {"OkPercent": 99.95, "KoPercent": 0.05};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.88225, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ConfirmationPage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 1"], "isController": false}, {"data": [0.995, 500, 1500, "ConfirmationPage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 3"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 3"], "isController": false}, {"data": [0.52, 500, 1500, "HomePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 4"], "isController": false}, {"data": [0.555, 500, 1500, "HomePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 1"], "isController": false}, {"data": [0.51, 500, 1500, "HomePage 3"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 2"], "isController": false}, {"data": [0.555, 500, 1500, "HomePage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 3"], "isController": false}, {"data": [0.515, 500, 1500, "HomePage 5"], "isController": false}, {"data": [0.995, 500, 1500, "ReservePage 4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2000, 1, 0.05, 391.33099999999973, 290, 1629, 339.0, 571.0, 593.0, 652.99, 42.22705487405781, 64.25681455592974, 25.58365707408737], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ConfirmationPage 4", 100, 0, 0.0, 332.13999999999993, 294, 404, 333.0, 357.9, 370.9, 403.7899999999999, 3.780718336483932, 5.6693422140831755, 2.802309782608696], "isController": false}, {"data": ["ConfirmationPage 5", 100, 0, 0.0, 326.45, 296, 366, 330.0, 342.0, 347.95, 365.99, 3.3507572711432783, 4.976659881383193, 2.4901623860742528], "isController": false}, {"data": ["ReservePage 5", 100, 0, 0.0, 327.44999999999993, 292, 424, 326.5, 353.70000000000005, 385.4499999999999, 423.96999999999997, 4.773041859577109, 7.109175501766026, 2.8619606462698677], "isController": false}, {"data": ["PurchasePage 1", 100, 0, 0.0, 330.22, 294, 445, 331.5, 354.8, 376.1999999999998, 444.65999999999985, 4.258399693395222, 7.220690566047779, 2.802891985691777], "isController": false}, {"data": ["ConfirmationPage 2", 100, 0, 0.0, 328.87, 296, 513, 322.5, 355.9, 376.4499999999999, 512.1099999999996, 3.1336174479819507, 4.72053151048195, 2.322671526385059], "isController": false}, {"data": ["ConfirmationPage 3", 100, 0, 0.0, 336.63000000000005, 293, 431, 334.0, 374.30000000000007, 391.95, 430.8099999999999, 3.4569779099111555, 5.14033034664846, 2.592733432433367], "isController": false}, {"data": ["PurchasePage 3", 100, 0, 0.0, 335.82999999999987, 299, 423, 334.5, 358.9, 384.74999999999994, 422.87999999999994, 4.080300310102824, 6.8789320706504, 2.6537890688754695], "isController": false}, {"data": ["HomePage 1", 100, 0, 0.0, 569.5399999999998, 490, 1364, 561.5, 627.0, 647.9, 1357.3299999999967, 7.094211123723042, 9.886725400822929, 3.159140891032917], "isController": false}, {"data": ["PurchasePage 2", 100, 0, 0.0, 330.33, 293, 499, 327.0, 356.9, 386.5499999999999, 498.6199999999998, 3.7137445686485684, 6.346622639451109, 2.4480249842165858], "isController": false}, {"data": ["ConfirmationPage 1", 100, 0, 0.0, 329.41000000000014, 292, 421, 329.5, 345.9, 373.4999999999999, 420.66999999999985, 3.6119338293722456, 5.444320064743914, 2.673677580726721], "isController": false}, {"data": ["PurchasePage 5", 100, 0, 0.0, 330.25999999999993, 296, 413, 331.0, 350.9, 378.7999999999997, 412.99, 4.1366757673533545, 6.9793476462314885, 2.722772917183751], "isController": false}, {"data": ["PurchasePage 4", 100, 0, 0.0, 333.3, 296, 450, 334.0, 363.9, 376.84999999999997, 449.5999999999998, 4.111503988158868, 6.966790932591892, 2.686129070388948], "isController": false}, {"data": ["HomePage 2", 100, 0, 0.0, 572.7999999999998, 484, 1264, 558.0, 620.0, 666.95, 1262.5699999999993, 5.5383252104563585, 7.784862459154851, 2.3256639067346034], "isController": false}, {"data": ["ReservePage 1", 100, 0, 0.0, 329.94, 290, 437, 329.5, 355.40000000000003, 373.84999999999997, 436.72999999999985, 5.84487696533988, 8.710407808025016, 3.516058799462271], "isController": false}, {"data": ["HomePage 3", 100, 1, 1.0, 576.3100000000002, 492, 1629, 568.0, 608.0, 619.75, 1623.129999999997, 6.882312456985547, 9.66561639710943, 2.890033551273228], "isController": false}, {"data": ["ReservePage 2", 100, 0, 0.0, 328.81000000000006, 291, 450, 325.5, 362.8, 385.29999999999984, 449.95, 4.210880916287687, 6.318007371673404, 2.5289958628094995], "isController": false}, {"data": ["HomePage 4", 100, 0, 0.0, 572.3099999999997, 493, 1240, 561.5, 628.9, 644.6999999999999, 1237.929999999999, 5.898313082458417, 8.297498009319334, 2.476830688922968], "isController": false}, {"data": ["ReservePage 3", 100, 0, 0.0, 337.8300000000001, 293, 424, 334.5, 376.9, 393.0, 423.90999999999997, 4.839802536056529, 7.162813225970381, 2.8878118647759172], "isController": false}, {"data": ["HomePage 5", 100, 0, 0.0, 561.69, 494, 713, 561.0, 616.8, 651.2499999999998, 712.7799999999999, 7.487832272557095, 10.584314161362785, 3.144304567577686], "isController": false}, {"data": ["ReservePage 4", 100, 0, 0.0, 336.5, 293, 536, 332.5, 376.1, 396.6499999999999, 534.9499999999995, 4.413257425305618, 6.585967841144799, 2.641920704797211], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,629 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 100.0, 0.05], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2000, 1, "The operation lasted too long: It took 1,629 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HomePage 3", 100, 1, "The operation lasted too long: It took 1,629 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
