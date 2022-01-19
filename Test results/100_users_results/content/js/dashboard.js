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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.87875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ConfirmationPage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 3"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 3"], "isController": false}, {"data": [0.5, 500, 1500, "HomePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 4"], "isController": false}, {"data": [0.525, 500, 1500, "HomePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 1"], "isController": false}, {"data": [0.55, 500, 1500, "HomePage 3"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 2"], "isController": false}, {"data": [0.5, 500, 1500, "HomePage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 3"], "isController": false}, {"data": [0.5, 500, 1500, "HomePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 400, 0, 0.0, 388.49750000000034, 294, 1282, 336.0, 568.0, 580.95, 717.0900000000008, 8.607889130388001, 13.051060417966816, 5.215170328606168], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ConfirmationPage 4", 20, 0, 0.0, 325.0, 299, 371, 324.5, 347.6, 369.84999999999997, 371.0, 0.865463672162361, 1.2905043760006922, 0.6414911398156562], "isController": false}, {"data": ["ConfirmationPage 5", 20, 0, 0.0, 339.5000000000001, 302, 391, 340.5, 370.9, 390.0, 391.0, 0.9928021841648053, 1.506315540456689, 0.7378149044427897], "isController": false}, {"data": ["ReservePage 5", 20, 0, 0.0, 328.7, 298, 361, 333.5, 345.9, 360.25, 361.0, 1.1314777098891153, 1.6791504900712833, 0.6784446424530437], "isController": false}, {"data": ["PurchasePage 1", 20, 0, 0.0, 335.25, 297, 402, 338.5, 367.8, 400.34999999999997, 402.0, 1.2638230647709319, 2.1797862361769353, 0.8318522906793049], "isController": false}, {"data": ["ConfirmationPage 2", 20, 0, 0.0, 329.54999999999995, 294, 372, 332.5, 347.9, 370.79999999999995, 372.0, 0.9261403102570039, 1.3874920409817089, 0.6864653276221347], "isController": false}, {"data": ["ConfirmationPage 3", 20, 0, 0.0, 331.34999999999997, 304, 410, 335.0, 362.3, 407.7, 410.0, 1.0623041376746163, 1.574160447761194, 0.7967281032559621], "isController": false}, {"data": ["PurchasePage 3", 20, 0, 0.0, 330.25000000000006, 298, 378, 335.5, 357.5, 377.0, 378.0, 0.8516436722875149, 1.4692100871870208, 0.553901060296372], "isController": false}, {"data": ["HomePage 1", 20, 0, 0.0, 549.25, 511, 608, 553.0, 587.1, 607.0, 608.0, 1.8120866177403279, 2.5205523183383165, 0.8069448219624897], "isController": false}, {"data": ["PurchasePage 2", 20, 0, 0.0, 330.90000000000003, 300, 361, 332.0, 354.8, 360.75, 361.0, 0.9381743127873159, 1.5522936896050286, 0.6184254503236701], "isController": false}, {"data": ["ConfirmationPage 1", 20, 0, 0.0, 329.19999999999993, 299, 354, 334.5, 352.1, 353.95, 354.0, 1.1452785890167783, 1.7102006742827691, 0.8477745805417167], "isController": false}, {"data": ["PurchasePage 5", 20, 0, 0.0, 335.0, 301, 368, 339.0, 360.5, 367.65, 368.0, 1.0370754472387864, 1.7889045080373347, 0.682606300233342], "isController": false}, {"data": ["PurchasePage 4", 20, 0, 0.0, 324.75000000000006, 300, 350, 326.0, 344.9, 349.75, 350.0, 0.7268762493185535, 1.230614267217881, 0.4748830183536253], "isController": false}, {"data": ["HomePage 2", 20, 0, 0.0, 598.7, 499, 1282, 565.5, 709.8000000000002, 1253.8499999999995, 1282.0, 1.264782141276165, 1.737160979099475, 0.5311096882312022], "isController": false}, {"data": ["ReservePage 1", 20, 0, 0.0, 323.15, 301, 346, 327.5, 336.9, 345.55, 346.0, 1.5429717636167257, 2.283116031476624, 0.9281939515506866], "isController": false}, {"data": ["HomePage 3", 20, 0, 0.0, 552.25, 497, 623, 563.0, 589.2, 621.35, 623.0, 2.173676774263667, 2.974795538528421, 0.9127744266927508], "isController": false}, {"data": ["ReservePage 2", 20, 0, 0.0, 326.45000000000005, 298, 359, 333.0, 339.9, 358.05, 359.0, 1.2780369352674292, 1.9003310914435427, 0.7675710109272158], "isController": false}, {"data": ["HomePage 4", 20, 0, 0.0, 547.85, 503, 718, 538.5, 601.6, 712.3499999999999, 718.0, 1.1863099827985053, 1.6645411946141524, 0.498157512307966], "isController": false}, {"data": ["ReservePage 3", 20, 0, 0.0, 321.49999999999994, 296, 337, 328.0, 334.0, 336.85, 337.0, 1.197676507575304, 1.7596136931852204, 0.7146292442661236], "isController": false}, {"data": ["HomePage 5", 20, 0, 0.0, 594.6500000000001, 506, 1125, 576.0, 625.7, 1100.0999999999997, 1125.0, 1.5520720161415489, 2.1526662899658544, 0.6517489911531895], "isController": false}, {"data": ["ReservePage 4", 20, 0, 0.0, 316.7, 297, 342, 310.0, 340.8, 341.95, 342.0, 0.8685079034219212, 1.2823637935339587, 0.519917328903943], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 400, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
