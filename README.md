# blazedemo-load-testing

## Introduction
Basic Performance Testing project to verify the stability of a fictional travel agency website called [BlazeDemo](https://blazedemo.com) using JMeter.

## Test Strategy
The main purpose is to check the stability & response time of the server given an amount of requests, so I divided various JMeter test plans to execute them in ascendent order of user interactions:
<ul>
  <li>100 users test plan</li>
  <li>200 users test plan</li>
  <li>300 users test plan</li>
  <li>400 users test plan</li>
  <li>500 users test plan</li>
  <li>1000 users test plan</li>
</ul>

Each JMeter test plan simulates users interacting with the webpage filling a form with dynamic input choices. For that, every test plan contains 5 possible input alternatives to follow. Moreover, in every request there's a _Duration Assertion_ with the value of 1500ms (milliseconds) = 1,5s (seconds). If responses take more than that time, tests will fail and those will be the main indicative that the server stability is going down when many requests are made.

## Execute Tests
Test plans are in "test cases" folder in .jmx format.
<ol>
  <li>Install <a href="https://www.oracle.com/java/technologies/downloads/">Java</a> and <a href="https://jmeter.apache.org/download_jmeter.cgi">JMeter</a></li>
  <li>Clone this repository: <code>git clone https://github.com/iandav/blazedemo-load-testing/</code></li>
  <li>Go to JMeter <i>bin</i> folder and open a terminal there</li>
  <li>Create an empty folder for each test plan</li>
  <li>Execute: <code>./jmeter -n -t test_plan_path.jmx -l any_log_name -e -o empty_folder_path </code></li>
  <li>View Test Results: Go to the recent empty folder and open the new .html file</li>
</ol>

## View Test Results directly
All test results are in "test results" folder, open the .html files to visualize them.

## Test Results in a nutshell
| Test Plans | Tests Passed | Tests Failed |
| --- | --- | --- |
| 100 users | 100% | 0% |
| 200 users | 99.75% | 0.25% |
| 300 users | 100% | 0% |
| 400 users | 99.94% | 0.06% |
| 500 users | 99.95% | 0.05% |

**100 users:** All tests passed, the average response time is 388.50ms (below 1500ms).

**200 users:** 2 responses took 1502ms but is still an acceptable margin of error.

**300 users:** All tests passed, the average response time is 387.26ms (below 1500ms).

**400 users:** A response failed by returning 500 status code (Internal Server Error).

**500 users:** A response took 1629ms but is still an acceptable margin of error.

**1000 users:** Server started to return 429 status code (Too many requests). The problem is that JMeter sends lots of requests with the same IP and server rejects them. After hours thinking, the decission was to make a **Distributed Testing** to send multiple requests from different IPs by avoiding server rejections.
