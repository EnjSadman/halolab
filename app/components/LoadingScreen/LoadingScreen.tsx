import styles from "./styles.module.css"

export function LoadingScreen() {
  return (
    <div className={styles.loading}>
      <div className={styles.wrapper}>
        <div className={styles.dot}></div>
          <span className={styles.text}>
            Loading
          </span>
      </div>
    </div>
  )
}