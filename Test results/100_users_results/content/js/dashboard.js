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

    var data = {"OkPercent": 97.6923076923077, "KoPercent": 2.3076923076923075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9105769230769231, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.985, 500, 1500, "/-22"], "isController": false}, {"data": [0.99, 500, 1500, "/confirmation.php-7"], "isController": false}, {"data": [0.98, 500, 1500, "/assets/bootstrap.min.js-10"], "isController": false}, {"data": [0.97, 500, 1500, "/confirmation.php-13"], "isController": false}, {"data": [0.98, 500, 1500, "/assets/bootstrap-table.js-9"], "isController": false}, {"data": [0.97, 500, 1500, "/confirmation.php-17"], "isController": false}, {"data": [0.94, 500, 1500, "/reserve.php-5"], "isController": false}, {"data": [0.945, 500, 1500, "/assets/bootstrap-table.js-4"], "isController": false}, {"data": [0.985, 500, 1500, "/reserve.php-23"], "isController": false}, {"data": [0.2, 500, 1500, "/-1"], "isController": false}, {"data": [0.975, 500, 1500, "/-18"], "isController": false}, {"data": [0.98, 500, 1500, "/confirmation.php-21"], "isController": false}, {"data": [0.965, 500, 1500, "/-14"], "isController": false}, {"data": [0.95, 500, 1500, "/-8"], "isController": false}, {"data": [0.98, 500, 1500, "/purchase.php-20"], "isController": false}, {"data": [0.5, 500, 1500, "/-1-1"], "isController": false}, {"data": [0.625, 500, 1500, "/-1-0"], "isController": false}, {"data": [0.96, 500, 1500, "/assets/bootstrap.min.js-3"], "isController": false}, {"data": [1.0, 500, 1500, "/purchase.php-24"], "isController": false}, {"data": [1.0, 500, 1500, "/confirmation.php-25"], "isController": false}, {"data": [0.985, 500, 1500, "/reserve.php-11"], "isController": false}, {"data": [0.965, 500, 1500, "/purchase.php-16"], "isController": false}, {"data": [0.97, 500, 1500, "/reserve.php-19"], "isController": false}, {"data": [0.945, 500, 1500, "/purchase.php-6"], "isController": false}, {"data": [0.96, 500, 1500, "/reserve.php-15"], "isController": false}, {"data": [0.97, 500, 1500, "/purchase.php-12"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2600, 60, 2.3076923076923075, 438.60730769230764, 220, 2981, 345.0, 633.0, 1025.8499999999995, 1914.9199999999983, 120.17564132193205, 306.12514805292346, 66.85853362606886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/-22", 100, 0, 0.0, 352.2399999999999, 290, 547, 335.5, 396.9, 467.94999999999976, 546.8399999999999, 17.784101013693757, 24.824104125911433, 7.467933042859683], "isController": false}, {"data": ["/confirmation.php-7", 100, 0, 0.0, 376.4599999999999, 306, 704, 355.5, 447.30000000000007, 481.69999999999993, 702.129999999999, 18.81821603312006, 28.381875999717728, 13.929890383891607], "isController": false}, {"data": ["/assets/bootstrap.min.js-10", 100, 0, 0.0, 294.43, 233, 924, 262.5, 378.0, 434.5999999999999, 921.6999999999988, 19.26040061633282, 158.22287443422573, 6.940515456471495], "isController": false}, {"data": ["/confirmation.php-13", 100, 0, 0.0, 367.7299999999999, 322, 721, 344.0, 451.0000000000001, 526.6999999999999, 720.4799999999998, 17.969451931716083, 26.805192890835578, 13.319154312668463], "isController": false}, {"data": ["/assets/bootstrap-table.js-9", 100, 0, 0.0, 298.27000000000004, 230, 1009, 266.0, 369.9000000000001, 451.49999999999966, 1006.1899999999986, 19.31620629708325, 170.1261665177709, 6.99835208615028], "isController": false}, {"data": ["/confirmation.php-17", 100, 0, 0.0, 369.5500000000002, 298, 674, 345.0, 473.00000000000006, 519.1499999999999, 673.92, 17.857142857142858, 26.587437220982146, 13.392857142857144], "isController": false}, {"data": ["/reserve.php-5", 100, 0, 0.0, 394.64000000000016, 308, 705, 359.0, 507.5, 655.4999999999999, 704.98, 19.230769230769234, 28.636380709134613, 11.568509615384615], "isController": false}, {"data": ["/assets/bootstrap-table.js-4", 100, 0, 0.0, 354.03999999999996, 220, 919, 300.5, 556.6000000000004, 660.8499999999999, 917.6899999999994, 19.615535504119265, 173.0996300632601, 7.604851167124362], "isController": false}, {"data": ["/reserve.php-23", 100, 0, 0.0, 351.88000000000005, 299, 564, 331.5, 425.70000000000016, 450.84999999999997, 563.7499999999999, 17.752529735487308, 26.270796811201848, 10.64458325936446], "isController": false}, {"data": ["/-1", 100, 60, 60.0, 1568.2299999999998, 809, 2981, 1628.5, 2132.7000000000003, 2409.7999999999984, 2977.3799999999983, 15.820281601012498, 25.5874515503876, 10.258463850656542], "isController": false}, {"data": ["/-18", 100, 0, 0.0, 363.8699999999999, 295, 680, 341.0, 433.0, 561.4999999999992, 679.6499999999999, 18.18512456810329, 25.503394083015095, 7.636331605746499], "isController": false}, {"data": ["/confirmation.php-21", 100, 0, 0.0, 362.51, 299, 550, 341.0, 435.30000000000007, 493.2999999999996, 549.6599999999999, 17.975912277548087, 27.005823914704298, 13.323942791659178], "isController": false}, {"data": ["/-14", 100, 0, 0.0, 368.4100000000001, 296, 688, 344.0, 420.20000000000005, 567.1999999999998, 687.97, 17.979144192736427, 25.198191972312117, 7.549835940309241], "isController": false}, {"data": ["/-8", 100, 0, 0.0, 388.4699999999999, 302, 804, 347.5, 507.1, 687.75, 803.6099999999998, 18.953752843062926, 26.425307406178923, 7.959095432145565], "isController": false}, {"data": ["/purchase.php-20", 100, 0, 0.0, 364.14000000000004, 304, 614, 345.0, 456.60000000000014, 485.5499999999999, 613.0099999999995, 17.818959372772632, 30.272915460174627, 11.64148810584462], "isController": false}, {"data": ["/-1-1", 100, 0, 0.0, 724.5299999999999, 513, 1467, 642.0, 1099.4000000000005, 1272.35, 1465.7799999999993, 16.99524133242692, 23.853086760707, 5.51017590074779], "isController": false}, {"data": ["/-1-0", 100, 0, 0.0, 842.15, 224, 2219, 886.5, 1338.0, 1690.449999999999, 2216.4199999999987, 17.765144785930005, 3.7993815508971402, 5.759793036063244], "isController": false}, {"data": ["/assets/bootstrap.min.js-3", 100, 0, 0.0, 313.0499999999999, 225, 624, 275.0, 492.5, 557.6999999999999, 623.9399999999999, 19.73164956590371, 162.07469045974744, 7.611329666535123], "isController": false}, {"data": ["/purchase.php-24", 100, 0, 0.0, 346.4100000000001, 299, 458, 336.0, 382.9, 409.5999999999999, 457.8599999999999, 17.91472590469366, 30.44226279783232, 11.791528573987819], "isController": false}, {"data": ["/confirmation.php-25", 100, 0, 0.0, 349.17999999999995, 296, 496, 337.0, 404.60000000000014, 459.4499999999999, 495.7599999999999, 17.95654516071108, 26.690896312174537, 13.34465905009876], "isController": false}, {"data": ["/reserve.php-11", 100, 0, 0.0, 367.63999999999993, 299, 722, 347.0, 448.9, 493.0999999999998, 720.6499999999993, 18.975332068311193, 28.245078273244783, 11.396317599620494], "isController": false}, {"data": ["/purchase.php-16", 100, 0, 0.0, 375.92999999999995, 300, 705, 347.5, 462.6, 568.7999999999997, 704.3199999999997, 17.75568181818182, 30.027562921697445, 11.54812899502841], "isController": false}, {"data": ["/reserve.php-19", 100, 0, 0.0, 360.0799999999999, 292, 590, 342.5, 438.30000000000007, 531.7499999999998, 589.8399999999999, 18.375597206909223, 26.916481475101065, 11.000235437339214], "isController": false}, {"data": ["/purchase.php-6", 100, 0, 0.0, 398.31, 320, 738, 367.0, 540.2, 632.55, 737.96, 19.26040061633282, 32.703934538713405, 12.677255874422187], "isController": false}, {"data": ["/reserve.php-15", 100, 0, 0.0, 379.6, 304, 740, 351.0, 485.30000000000007, 560.2499999999998, 739.0999999999996, 17.72735330615139, 26.049168476333982, 10.577551630916505], "isController": false}, {"data": ["/purchase.php-12", 100, 0, 0.0, 372.04000000000013, 304, 649, 350.0, 462.80000000000007, 534.4499999999996, 648.7799999999999, 17.905102954341988, 30.15016506266786, 11.802680170098478], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 2,417 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,538 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,542 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,970 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,779 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,725 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,682 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,900 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,899 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,915 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,747 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,073 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,619 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,653 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,882 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,681 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,629 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,845 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,588 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,570 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,544 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,528 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,981 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,135 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,935 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,767 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, 3.3333333333333335, 0.07692307692307693], "isController": false}, {"data": ["The operation lasted too long: It took 2,273 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,046 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,946 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,688 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,971 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,812 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,806 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,197 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, 3.3333333333333335, 0.07692307692307693], "isController": false}, {"data": ["The operation lasted too long: It took 1,962 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,112 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,936 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,765 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, 3.3333333333333335, 0.07692307692307693], "isController": false}, {"data": ["The operation lasted too long: It took 1,609 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,683 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,645 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,950 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,541 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,866 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,610 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,753 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,271 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,907 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,991 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,628 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 2,534 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,897 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,674 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,526 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,885 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,928 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}, {"data": ["The operation lasted too long: It took 1,986 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 1.6666666666666667, 0.038461538461538464], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2600, 60, "The operation lasted too long: It took 1,767 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 2,197 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,765 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 2,417 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,538 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/-1", 100, 60, "The operation lasted too long: It took 1,767 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 2,197 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,765 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 2,417 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,538 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
