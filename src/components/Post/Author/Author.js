// @flow strict
import React from 'react';
import { getContactHref } from '../../../utils';
import styles from './Author.module.scss';
import { useSiteMetadata } from '../../../hooks';

const Author = () => {
  const { author } = useSiteMetadata();

  return (
    <div className={styles['author']}>
      
      <img className={styles['author__photo']} src={author.photo}></img>

      <p className={styles['author__bio']}>
      Personal blog by &nbsp;
        <a
          className={styles['author__bio__link']}
          href={getContactHref('twitter', author.contacts.twitter)}
          rel="noopener noreferrer"
          target="_blank"
        >
        {author.name}
        </a>
        <br/> {author.bio}
      </p>


    </div>
  );
};

export default Author;
