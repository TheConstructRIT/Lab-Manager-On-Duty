import React from 'react';

import { Card, CardTitle, CardImg, CardBody } from 'shards-react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';

/*
 * Unescapes an HTML string.
 */
function unescapeHTML(text) {
  // Replace the characters.
  text = text.replace('&amp;', '&');
  text = text.replace('&lt;', '<');
  text = text.replace('&lt;', '<');

  // Return the string.
  return text;
}

/*
 * Returns the link in the <a href="..."> text.
 * Returns itself it if isn't used.
 */
function GetImageFromHREF(text) {
  // Return the link if it is a link tag.
  if (text != null) {
    var start = text.indexOf('>');
    if (start != -1) {
      var subText = text.substring(start + 1);
      var end = subText.indexOf('<');
      if (end != -1) {
        return unescapeHTML(subText.substring(0, end).trim());
      }
    }
  }

  // Return itself (not a link).
  return unescapeHTML(text);
}

const Contacts = ({ contacts }) => {
  if (contacts.description == null || contacts.description.trim() == '') {
    contacts.description = 'constructlogo.png';
  }

  return (
    <div>
      <Card>
        <CardBody>
          <CardImg top src={GetImageFromHREF(contacts.description)} />
          <center>
            <CardTitle>{contacts.summary}</CardTitle>
          </center>
        </CardBody>
      </Card>
    </div>
  );
};

export default Contacts;
