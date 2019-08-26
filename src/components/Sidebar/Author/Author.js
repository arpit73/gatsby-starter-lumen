// @flow strict
import React from "react";
import { withPrefix, Link } from "gatsby";
import styles from "./Author.module.scss";

type Props = {
  author: {
    name: string,
    bio: string,
    photo: string
  },
  isIndex: ?boolean
};

const Author = ({ author, isIndex }: Props) => (
  <div className={styles["author"]}>
    <Link to="/">
      <img
        src={withPrefix(author.photo)}
        className={styles["author__photo"]}
        width="75"
        height="75"
        alt={author.name}
      />
    </Link>

    {isIndex === true ? (
      <p className={styles["author__bio"]}>
        <h1 className={styles["author__bio__title"]}>
          <Link className={styles["author__bio__title-link"]} to="/">
            {author.name}
          </Link>
        </h1>
        <p className={styles["author__bio__subtitle"]}>{author.bio}</p>
      </p>
    ) : (
      <p>
        <h1 className={styles["author__bio__title"]}>
          <Link className={styles["author__title-link"]} to="/">
            {author.name}
          </Link>
        </h1>
        <p className={styles["author__bio__subtitle"]}>{author.bio}</p>
      </p>
    )}
  </div>
);

export default Author;
