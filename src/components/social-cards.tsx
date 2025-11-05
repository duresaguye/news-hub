import React from 'react';
import styled from 'styled-components';

const SocialCards = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <ul>
          <li className="iso-pro">
            <span />
            <span />
            <span />
            <a href="#">
              <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg" className="svg">
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
              </svg>
            </a>
            <div className="text">Facebook</div>
          </li>
          <li className="iso-pro">
            <span />
            <span />
            <span />
            <a href="#">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
              </svg>
            </a>
            <div className="text">X </div>
          </li>
          <li className="iso-pro">
            <span />
            <span />
            <span />
            <a href="#">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </a>
            <div className="text">Instagram</div>
          </li>
          <li className="iso-pro">
            <span />
            <span />
            <span />
            <a href="#">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
              </svg>
            </a>
            <div className="text">LinkedIn</div>
          </li>
        </ul>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    max-width: fit-content;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    gap: 1rem;
    backdrop-filter: blur(15px);
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1),
      inset 0 0 5px rgba(255, 255, 255, 0.2), 
      0 5px 5px rgba(0, 0, 0, 0.1);
    transition: 0.5s;
    background: rgba(255, 255, 255, 0.05);
  }

  .card:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .card ul {
    padding: 1rem;
    display: flex;
    list-style: none;
    gap: 1.5rem;
    align-items: center;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .card ul li {
    cursor: pointer;
  }

  .svg {
    transition: all 0.3s;
    padding: 0.8rem;
    height: 45px;
    width: 45px;
    border-radius: 100%;
    color: var(--brand-accent);
    fill: currentColor;
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2),
      inset 0 0 5px rgba(255, 255, 255, 0.3), 
      0 5px 5px rgba(0, 0, 0, 0.1);
  }

  .text {
    opacity: 0;
    border-radius: 5px;
    padding: 5px 8px;
    transition: all 0.3s;
    color: var(--brand-accent);
    background-color: rgba(255, 255, 255, 0.9);
    position: absolute;
    z-index: 9999;
    font-weight: 600;
    font-size: 0.8rem;
    box-shadow: -5px 0 1px rgba(153, 153, 153, 0.2),
      -10px 0 1px rgba(153, 153, 153, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.3),
      inset 0 0 5px rgba(255, 255, 255, 0.5), 
      0 5px 5px rgba(0, 0, 0, 0.082);
  }

  /*isometric projection*/
  .iso-pro {
    transition: 0.5s;
    position: relative;
  }
  
  .iso-pro:hover a > .svg {
    transform: translate(8px, -8px);
    border-radius: 100%;
  }

  .iso-pro:hover .text {
    opacity: 1;
    transform: translate(15px, -2px) skew(-5deg);
  }

  .iso-pro:hover .svg {
    transform: translate(3px, -3px);
  }

  .iso-pro span {
    opacity: 0;
    position: absolute;
    color: var(--brand-accent);
    border-color: var(--brand-accent);
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2),
      inset 0 0 5px rgba(255, 255, 255, 0.3), 
      0 5px 5px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    transition: all 0.3s;
    height: 45px;
    width: 45px;
  }

  .iso-pro:hover span {
    opacity: 1;
  }

  .iso-pro:hover span:nth-child(1) {
    opacity: 0.2;
  }

  .iso-pro:hover span:nth-child(2) {
    opacity: 0.4;
    transform: translate(3px, -3px);
  }

  .iso-pro:hover span:nth-child(3) {
    opacity: 0.6;
    transform: translate(6px, -6px);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card ul {
      gap: 1rem;
    }
    
    .svg {
      height: 40px;
      width: 40px;
      padding: 0.7rem;
    }
    
    .iso-pro span {
      height: 40px;
      width: 40px;
    }
  }

  @media (max-width: 480px) {
    .card ul {
      gap: 0.8rem;
    }
    
    .svg {
      height: 35px;
      width: 35px;
      padding: 0.6rem;
    }
    
    .iso-pro span {
      height: 35px;
      width: 35px;
    }
    
    .text {
      font-size: 0.7rem;
      padding: 4px 6px;
    }
  }`;

export default SocialCards;