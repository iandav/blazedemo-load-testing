# blazedemo-load-testing

## Introduction
Basic Performance Testing project to verify the stability of a fictional travel agency website called [BlazeDemo](https://blazedemo.com/) using JMeter.

## Test Strategy
The main purpose is to check the stability & response time of the server given an amount of requests, so I divided various JMeter test plans to execute them in ascendent order of user interactions:
<ol>
  <li>100 users test plan</li>
  <li>200 users test plan</li>
  <li>300 users test plan</li>
  <li>400 users test plan</li>
  <li>500 users test plan</li>
</ol>

Each JMeter test plan simulates users interacting with the webpage filling a form with dynamic input choices. For that, every test plan contains 5 possible input alternatives to follow and a "Random Order Controller" is applied to ensure every input alternative will execute at least once in the test.

Moreover, a "Uniform Random Timer" is applied to add random delay to the responses, creating a more realistic scenario.

Finally there's a "Duration assertion" with the value of 1500ms (milliseconds) = 1,5s (seconds). If responses take more than that time, tests will fail and those will be the main indicative that the server stability is going down when many requests are made.




