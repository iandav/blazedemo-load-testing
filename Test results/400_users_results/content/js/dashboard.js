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

    var data = {"OkPercent": 99.9375, "KoPercent": 0.0625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.880625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.98125, 500, 1500, "ConfirmationPage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 3"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 3"], "isController": false}, {"data": [0.5125, 500, 1500, "HomePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 4"], "isController": false}, {"data": [0.55, 500, 1500, "HomePage 2"], "isController": false}, {"data": [0.99375, 500, 1500, "ReservePage 1"], "isController": false}, {"data": [0.525, 500, 1500, "HomePage 3"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 2"], "isController": false}, {"data": [0.53125, 500, 1500, "HomePage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 3"], "isController": false}, {"data": [0.51875, 500, 1500, "HomePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 1, 0.0625, 388.84625, 290, 1422, 337.5, 567.0, 583.0, 646.96, 32.4688501968424, 49.31176897525265, 19.671557287227568], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ConfirmationPage 4", 80, 1, 1.25, 343.73749999999995, 298, 1127, 333.0, 355.8, 378.15000000000003, 1127.0, 2.5990058802508043, 3.8685593385530037, 1.9264115850687114], "isController": false}, {"data": ["ConfirmationPage 5", 80, 0, 0.0, 329.725, 296, 402, 333.0, 354.8, 363.70000000000005, 402.0, 2.7287921683664766, 4.089224308848109, 2.027940273561415], "isController": false}, {"data": ["ReservePage 5", 80, 0, 0.0, 328.0875, 290, 383, 331.5, 351.0, 361.9, 383.0, 4.0864279511671855, 6.10320385528937, 2.4502605097818866], "isController": false}, {"data": ["PurchasePage 1", 80, 0, 0.0, 334.45, 297, 442, 335.0, 364.70000000000005, 376.0, 442.0, 3.5426445841820917, 6.0056734207554685, 2.3317797360729786], "isController": false}, {"data": ["ConfirmationPage 2", 80, 0, 0.0, 326.32500000000005, 294, 440, 326.5, 345.9, 352.95, 440.0, 2.3005693909242537, 3.4611325092022773, 1.7052071950307701], "isController": false}, {"data": ["ConfirmationPage 3", 80, 0, 0.0, 327.39999999999986, 295, 440, 323.0, 353.8, 369.65000000000003, 440.0, 2.611903751346763, 3.9073659256750135, 1.958927813510072], "isController": false}, {"data": ["PurchasePage 3", 80, 0, 0.0, 334.8875, 294, 429, 333.0, 368.9, 401.85, 429.0, 3.1629304550666193, 5.300572601609141, 2.057140315502313], "isController": false}, {"data": ["HomePage 1", 80, 0, 0.0, 566.2624999999999, 493, 1169, 562.5, 608.7, 639.25, 1169.0, 5.926803970958661, 8.293184638464957, 2.6392798933175285], "isController": false}, {"data": ["PurchasePage 2", 80, 0, 0.0, 327.43749999999983, 292, 391, 331.5, 348.9, 360.8, 391.0, 2.677645011212639, 4.548531792850688, 1.7650492017270811], "isController": false}, {"data": ["ConfirmationPage 1", 80, 0, 0.0, 331.125, 299, 443, 331.0, 355.8, 362.75, 443.0, 2.8472790689397445, 4.269632600900452, 2.1076538420471937], "isController": false}, {"data": ["PurchasePage 5", 80, 0, 0.0, 331.1124999999999, 294, 385, 331.0, 357.70000000000005, 365.9, 385.0, 3.5932446999640675, 6.0844352851015095, 2.365084890406037], "isController": false}, {"data": ["PurchasePage 4", 80, 0, 0.0, 329.88749999999993, 291, 370, 333.0, 351.0, 358.85, 370.0, 3.1082446188515034, 5.282118730087808, 2.030679345714508], "isController": false}, {"data": ["HomePage 2", 80, 0, 0.0, 583.4875000000001, 489, 1422, 553.0, 629.9000000000002, 1013.4500000000008, 1422.0, 4.411602514613433, 6.2418898029943755, 1.8525283996911879], "isController": false}, {"data": ["ReservePage 1", 80, 0, 0.0, 330.32500000000005, 291, 502, 327.0, 365.5, 386.9, 502.0, 4.103616311874839, 6.1048806585021795, 2.468581687612208], "isController": false}, {"data": ["HomePage 3", 80, 0, 0.0, 549.6875000000001, 493, 661, 556.0, 600.8, 621.4000000000001, 661.0, 5.965252404742376, 8.363732430467527, 2.5049399746476775], "isController": false}, {"data": ["ReservePage 2", 80, 0, 0.0, 325.02499999999986, 293, 407, 324.0, 351.70000000000005, 369.5, 407.0, 3.81333714667048, 5.656884563134564, 2.2902366652366655], "isController": false}, {"data": ["HomePage 4", 80, 0, 0.0, 567.575, 487, 1242, 558.5, 598.0, 683.8500000000001, 1242.0, 4.778687055731438, 6.671786799623678, 2.006675228480975], "isController": false}, {"data": ["ReservePage 3", 80, 0, 0.0, 325.83750000000003, 291, 407, 328.0, 351.9, 357.0, 407.0, 4.024549753496328, 5.920391733323272, 2.4013670892443906], "isController": false}, {"data": ["HomePage 5", 80, 0, 0.0, 551.2250000000001, 491, 691, 556.0, 594.8, 609.0, 691.0, 5.922416345869115, 8.26036827713207, 2.4869521764880074], "isController": false}, {"data": ["ReservePage 4", 80, 0, 0.0, 333.325, 290, 482, 329.0, 364.8, 400.3500000000001, 482.0, 3.462903644706086, 5.133526385702536, 2.073007748246905], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1, 100.0, 0.0625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1600, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ConfirmationPage 4", 80, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
