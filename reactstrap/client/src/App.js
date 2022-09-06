import { useCallback } from 'react';
import React from 'react';
import { ReactSession } from 'react-client-session';
import 'survey-core/defaultV2.min.css';
import { StylesManager, Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

ReactSession.setStoreType("localStorage");
//Using default survey theme
StylesManager.applyTheme("defaultV2");

//Initializing uuID
let uuid;

//Survey to show if User is a new one
const surveyJson = {
  "title": "JavaScript survey",
  "description": "In this survey we ask you about your experiences with JavaScript",
  "logoPosition": "right",
  "completedHtml": "<h3>Thank you for your feedback.</h3><h5>Your thoughts and ideas will help us to create a great product!</h5>",
  "completedHtmlOnCondition": [
   {
    "expression": "{nps_score} > 8",
    "html": "<h3>Thank you for your feedback.</h3><h5>We glad that you love our product. Your ideas and suggestions will help us to make our product even better!</h5>"
   },
   {
    "expression": "{nps_score} < 7",
    "html": "<h3>Thank you for your feedback.</h3><h5> We are glad that you share with us your ideas.We highly value all suggestions from our customers. We do our best to improve the product and reach your expectation.</h5><br />"
   }
  ],
  "pages": [
   {
    "name": "page1",
    "elements": [
     {
      "type": "rating",
      "name": "nps_score",
      "title": "On a scale of zero to ten, how likely are you to recommend JavaScript to a fellow programmer or colleague?",
      "isRequired": true,
      "rateMin": 0,
      "rateMax": 10,
      "minRateDescription": "(Most unlikely)",
      "maxRateDescription": "(Most likely)"
     },
     {
      "type": "checkbox",
      "name": "promoter_features",
      "visible": false,
      "visibleIf": "{nps_score} >= 9",
      "title": "Which features do you value the most?",
      "isRequired": true,
      "validators": [
       {
        "type": "answercount",
        "text": "Please select two features maximum.",
        "maxCount": 2
       }
      ],
      "choices": [
       "Performance",
       "Stability",
       {
        "value": "User Interface",
        "text": "UI Design"
       },
       "Complete Functionality",
       {
        "value": "item1",
        "text": "Community Support"
       }
      ],
      "hasOther": true,
      "otherText": "Other feature:",
      "colCount": 2
     },
     {
      "type": "comment",
      "name": "passive_experience",
      "visible": false,
      "visibleIf": "{nps_score} > 6  and {nps_score} < 9",
      "title": "What do you like about JavaScript?"
     },
     {
      "type": "comment",
      "name": "disappointed_experience",
      "visible": false,
      "visibleIf": "{nps_score} notempty",
      "title": "What do you miss in your experience with JavaScript?"
     }
    ]
   }
  ],
  "showQuestionNumbers": "off"
  }

//Html to show if User is a returning one
const rawHTML = `<div id="surveyElement" style="display:inline-block;width:100%;">
<div class="sd-root-modern"><form><div class="sv_custom_header">
</div><div class="sd-container-modern"><div class="sd-title sd-container-modern__title">
<div class="sd-header__text"><h3 class="sd-title" aria-label="JavaScript survey.">
<span class="sv-string-viewer">JavaScript survey.</span></h3></div><div class="sd-hidden">
</div></div><div class="sd-body">
<h3>Our records show that you have already completed this survey.</h3>
</div></div></form></div></div>`;


function App() {
  //Checking local storage for uuID
  const isNew = localStorage.getItem("uuid") == null;

  if (isNew) {
    //It's a new user, creating uuID using crypto
    uuid = crypto.randomUUID();
    console.log(uuid);
    localStorage.setItem("uuid", uuid);
    uuid = localStorage.getItem("uuid");
    //It's not a new user
    const survey = new Model(surveyJson);
    const alertResults = useCallback((sender) => {
      const results = JSON.stringify(sender.data);
      const d = new Date();
      d.getTime();
      const dataJson = {
        "result": results,
        "user": uuid,
        "date": d
      }
      saveSurveyResults(
        "http://localhost:5000/survey/add",
        dataJson
      )
    }, []);
  
    survey.onComplete.add(alertResults);
  
    return <Survey model={survey} />;
  }
  else {
    // It's an old user
    return(<div><div dangerouslySetInnerHTML={{ __html: rawHTML }}></div></div>)
  }
}


function saveSurveyResults(url, json) {
  const request = new XMLHttpRequest();
  request.open('POST', url);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.addEventListener('load', () => {
    // Handle "load"
  });
  request.addEventListener('error', () => {
    // Handle "error"
  });
  request.send(JSON.stringify(json));
}

export default App;

