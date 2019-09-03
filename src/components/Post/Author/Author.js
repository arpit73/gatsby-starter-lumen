// @flow strict
import React from 'react';
import { withPrefix, Link } from 'gatsby';
import { getContactHref } from '../../../utils';
import styles from './Author.module.scss';
import { useSiteMetadata } from '../../../hooks';

const Author = () => {
  const { author } = useSiteMetadata();

  return (
    <div className={styles['author']}>
      <Link to="/">
        <img src={withPrefix(author.photo)} className={styles['author__photo']} alt={author.name} />
      </Link>

      <p className={styles['author__bio']}>
        Personal blog by &nbsp;
        <a
          className={styles['author__bio__link']}
          href={getContactHref('github', author.contacts.github)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {author.name}
        </a>
        <br /> {author.bio}
      </p>
    </div>
  );
};

export default Author;
