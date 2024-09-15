import styles from './overlay.module.css'

export function Overlay () {
  return (
    <div className={styles.overlay}>
      <svg className={styles.svgcontainer}>
        <polygon points="490,0 500,15 510,0" fill='lime' />
      </svg>  
    </div>
  )
}