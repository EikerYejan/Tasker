import React from "react"

type Props = {
  children: string | React.ReactElement | JSX.Element
  className?: string
  type?: "button" | "submit"
}

const Button: React.FC<Props> = ({ children, className = "", type }) => (
  // eslint-disable-next-line
  <button type={type ?? "button"} className={`btn ${className}`}>
    {children}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="9"
      viewBox="0 0 29.32 9.72"
    >
      <polygon points="29.32 4.86 24.44 0 23.45 0.98 26.65 4.17 0 4.17 0 5.56 26.65 5.56 23.45 8.74 24.44 9.72 29.32 4.87 29.31 4.86 29.32 4.86" />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="9"
      viewBox="0 0 29.32 9.72"
    >
      <polygon points="29.32 4.86 24.44 0 23.45 0.98 26.65 4.17 0 4.17 0 5.56 26.65 5.56 23.45 8.74 24.44 9.72 29.32 4.87 29.31 4.86 29.32 4.86" />
    </svg>
  </button>
)

export default Button
