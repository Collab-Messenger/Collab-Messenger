import styles from "./WrapperContainer.module.css";

export const WrapperContainer = ({ children }) => {
  return <div className={styles["wrapper-container"]}>{children}</div>;
};

export default WrapperContainer;
