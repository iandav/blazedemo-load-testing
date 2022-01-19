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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.88625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ConfirmationPage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 3"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 3"], "isController": false}, {"data": [0.5583333333333333, 500, 1500, "HomePage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ConfirmationPage 1"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "PurchasePage 4"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "HomePage 2"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 1"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "HomePage 3"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 2"], "isController": false}, {"data": [0.525, 500, 1500, "HomePage 4"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 3"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "HomePage 5"], "isController": false}, {"data": [1.0, 500, 1500, "ReservePage 4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 0, 0.0, 387.25833333333327, 289, 1450, 333.0, 561.9000000000001, 585.0, 878.6700000000003, 24.725444542888344, 37.66986267719902, 14.980142377351493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ConfirmationPage 4", 60, 0, 0.0, 324.93333333333334, 296, 374, 327.0, 350.4, 362.59999999999997, 374.0, 1.7407450388766392, 2.6284853432894275, 1.2902592622142275], "isController": false}, {"data": ["ConfirmationPage 5", 60, 0, 0.0, 324.75000000000006, 292, 379, 324.0, 354.0, 361.95, 379.0, 1.8638170974155068, 2.777949005187624, 1.3851218858722665], "isController": false}, {"data": ["ReservePage 5", 60, 0, 0.0, 324.41666666666674, 290, 418, 322.5, 346.6, 380.95, 418.0, 2.9795898098028504, 4.451586709167205, 1.786589983612256], "isController": false}, {"data": ["PurchasePage 1", 60, 0, 0.0, 327.34999999999997, 297, 407, 322.5, 347.9, 380.4, 407.0, 2.9997000299970003, 5.138841584591541, 1.9744119338066195], "isController": false}, {"data": ["ConfirmationPage 2", 60, 0, 0.0, 325.7, 294, 411, 322.5, 348.0, 362.44999999999993, 411.0, 2.1307574842856636, 3.1580225793707166, 1.5793407525125183], "isController": false}, {"data": ["ConfirmationPage 3", 60, 0, 0.0, 325.88333333333316, 294, 378, 326.0, 348.7, 351.84999999999997, 378.0, 2.285888448643706, 3.4305813181004265, 1.7144163364827796], "isController": false}, {"data": ["PurchasePage 3", 60, 0, 0.0, 328.40000000000015, 292, 364, 331.0, 349.9, 356.84999999999997, 364.0, 2.790827480347923, 4.77674833713196, 1.815128029210661], "isController": false}, {"data": ["HomePage 1", 60, 0, 0.0, 582.7000000000002, 489, 1450, 530.0, 651.4999999999999, 978.6499999999987, 1450.0, 4.665267086540704, 6.572908769730192, 2.0775017494751573], "isController": false}, {"data": ["PurchasePage 2", 60, 0, 0.0, 325.18333333333334, 293, 434, 325.0, 350.9, 360.9, 434.0, 2.4174053182917006, 4.12131408642224, 1.593504482272361], "isController": false}, {"data": ["ConfirmationPage 1", 60, 0, 0.0, 323.1499999999999, 298, 376, 326.5, 347.8, 351.95, 376.0, 2.245761125874911, 3.3685685846090507, 1.6623895834113112], "isController": false}, {"data": ["PurchasePage 5", 60, 0, 0.0, 326.38333333333344, 295, 386, 323.5, 354.8, 362.0, 386.0, 2.139418791228383, 3.633042320377964, 1.4081721340702442], "isController": false}, {"data": ["PurchasePage 4", 60, 0, 0.0, 324.71666666666664, 293, 386, 323.5, 347.6, 374.95, 386.0, 2.008300977373142, 3.399631236192931, 1.3120638221314767], "isController": false}, {"data": ["HomePage 2", 60, 0, 0.0, 554.5666666666667, 481, 956, 541.5, 612.9, 689.4499999999998, 956.0, 3.240090722540231, 4.559858144778054, 1.3605849713791986], "isController": false}, {"data": ["ReservePage 1", 60, 0, 0.0, 322.4666666666667, 293, 389, 321.5, 345.7, 360.95, 389.0, 3.50754121360926, 5.193147689407225, 2.1100052613118203], "isController": false}, {"data": ["HomePage 3", 60, 0, 0.0, 589.4666666666666, 487, 1447, 554.0, 608.9, 1034.9499999999998, 1447.0, 4.377964246625319, 6.146251368113827, 1.8384029551258665], "isController": false}, {"data": ["ReservePage 2", 60, 0, 0.0, 320.5666666666666, 289, 374, 319.5, 347.9, 356.65, 374.0, 2.45188181929631, 3.6549959646111723, 1.4725657410812798], "isController": false}, {"data": ["HomePage 4", 60, 0, 0.0, 567.3166666666666, 484, 1072, 559.0, 616.0, 745.6999999999998, 1072.0, 3.5356511490866236, 4.966312334266353, 1.4846972598703596], "isController": false}, {"data": ["ReservePage 3", 60, 0, 0.0, 327.70000000000005, 293, 402, 329.5, 354.6, 370.65, 402.0, 3.006162633398467, 4.509684305952202, 1.7937161806703743], "isController": false}, {"data": ["HomePage 5", 60, 0, 0.0, 570.2166666666667, 481, 1035, 550.0, 621.5, 871.8999999999994, 1035.0, 4.860267314702308, 6.809516124949372, 2.0409325637910083], "isController": false}, {"data": ["ReservePage 4", 60, 0, 0.0, 329.3000000000001, 295, 398, 325.5, 360.9, 390.8499999999999, 398.0, 2.625705658395694, 3.874197928974662, 1.5718335630825786], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1200, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
