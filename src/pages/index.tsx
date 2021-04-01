import React from 'react';
import styles from './index.less';
import $ from 'jquery';

$(() => {
  const $body = $('#root');

  $body.on('click', e => {
    console.log('index.tsx:9', e);
  });

  console.log('index.tsx:6', $body, $body[0].id);
});

console.dir($);
export default () => {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
};
