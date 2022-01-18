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
</ul>

Each JMeter test plan simulates users interacting with the webpage filling a form with dynamic input choices. For that, every test plan contains 5 possible input alternatives to follow and a _Random Order Controller_ is applied to ensure every input alternative will execute at least once in the test.

A _Uniform Random Timer_ is applied to add random delay to the responses, creating a more realistic scenario.

Finally there's a _Duration Assertion_ with the value of 1500ms (milliseconds) = 1,5s (seconds). If responses take more than that time, tests will fail and those will be the main indicative that the server stability is going down when many requests are made.

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
| Test Plans | Tests Failed |
| --- | --- |
| 100 users | 2.31% |
| 200 users | 5.04% | 
| 300 users | 9.83% |
| 400 users | 18.19% |
| 500 users | 18.38% |

**100-200 users:** A minimal percentage of responses take more than 1500ms to respond but the range of error is still acceptable.

**300 users**: Some responses take a little bit longer than expected like the previous test plan and
