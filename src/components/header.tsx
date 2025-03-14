import Link from "next/link"

export default function Header() {
  return (
    <header className="w-full py-4 mb-8 border-b border-secondary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="32" height="33" viewBox="0 0 560 576" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M414.945 185.287C404.674 185.287 395.484 179.452 389.219 171.312C379.951 159.271 368.219 149.697 354.023 142.59C335.249 132.386 312.989 127.284 287.241 127.284C242.72 127.284 207.05 142.053 180.23 171.592C153.41 200.593 140 239.53 140 288.403C140 340.498 153.946 381.315 181.839 410.853C210.268 439.855 249.157 454.355 298.506 454.355C332.299 454.355 360.728 445.762 383.793 428.576C397.895 418.308 409.698 405.355 419.204 389.719C429.13 373.392 415.562 354.462 396.455 354.462H288.69C273.226 354.462 260.69 341.926 260.69 326.462V280.957C260.69 265.493 273.226 252.957 288.69 252.957H532C547.464 252.957 560 265.493 560 280.957V376.982C560 379.677 559.621 382.362 558.813 384.933C548.48 417.83 531.443 448.49 507.701 476.912C483.563 506.45 452.72 530.35 415.172 548.61C377.625 566.87 335.249 576 288.046 576C232.261 576 182.375 563.916 138.391 539.748C94.9425 515.043 60.8812 480.94 36.2069 437.438C12.069 393.936 0 344.257 0 288.403C0 232.548 12.069 182.87 36.2069 139.368C60.8812 95.3287 94.9425 61.2252 138.391 37.0573C181.839 12.3524 231.456 0 287.241 0C354.828 0 411.686 16.3804 457.816 49.1412C494.843 75.1348 521.908 109.074 539.012 150.958C545.935 167.912 532.484 185.287 514.171 185.287H414.945Z"
              fill="url(#paint0_linear_1232_131)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1232_131"
                x1="1.36166e-05"
                y1="456.341"
                x2="560"
                y2="119.659"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6BBAFF" />
                <stop offset="0.7" stopColor="#1850E1" />
              </linearGradient>
            </defs>
          </svg>
          <h2 className="text-lg font-medium text-secondary">Calculadora de Horas</h2>
        </div>
        <Link
          href="https://guilhermeft.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary-light transition-colors"
        >
          guilhermeft.dev
        </Link>
      </div>
    </header>
  )
}

