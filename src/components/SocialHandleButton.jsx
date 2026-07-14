import React from "react";
import { useTheme } from "@mui/material/styles";
import styled from "styled-components";

const ReusableSocialButton = ({
  href,
  label,
  icon,
  color = "#1da1f2",
  name = "Sangram Mohapatra",
  username,
  about,
  size = 55,
}) => {
  const theme = useTheme();

  return (
    <StyledWrapper
      $color={color}
      $size={size}
      $cardBg={theme.palette.background.elevated}
      $iconBg={theme.palette.background.paper}
      $border={theme.palette.divider}
      $textPrimary={theme.palette.text.primary}
      $textMuted={theme.palette.text.muted}
    >
      <div className="tooltip-container">
        <div className="tooltip">
          <div className="profile">
            <div className="user">
              <div className="img">{name.charAt(0)}</div>
              <div className="details">
                <div className="name">{name}</div>
                {username && <div className="username">{username}</div>}
              </div>
            </div>
            {about && <div className="about">{about}</div>}
          </div>
        </div>
        <div className="text">
          <a
            className="icon"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
          >
            <div className="layer">
              <span />
              <span />
              <span />
              <span />
              <span className="fab-icon">{icon}</span>
            </div>
            <div className="text">{label}</div>
          </a>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .tooltip-container {
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 17px;
    border-radius: 10px;
  }

  .tooltip {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
    border-radius: 15px;
    box-shadow:
      inset 5px 5px 5px rgba(0, 0, 0, 0.2),
      inset -5px -5px 15px rgba(255, 255, 255, 0.1),
      5px 5px 15px rgba(0, 0, 0, 0.3),
      -5px -5px 15px rgba(255, 255, 255, 0.1);
  }

  .profile {
    background: ${(props) => props.$cardBg};
    border-radius: 10px 15px;
    padding: 10px;
    border: 1px solid ${(props) => props.$color}40;
  }

  .tooltip-container:hover .tooltip {
    top: -150px;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .icon {
    text-decoration: none;
    color: ${(props) => props.$textPrimary};
    display: block;
    position: relative;
  }
  .layer {
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
    transition: transform 0.3s;
  }
  .icon:hover .layer {
    transform: rotate(-35deg) skew(20deg);
  }
  .layer span {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 1px solid ${(props) => props.$border};
    border-radius: 5px;
    transition: all 0.3s;
  }

  .layer span,
  .text {
    color: ${(props) => props.$color};
    border-color: ${(props) => props.$color};
  }

  .icon:hover .layer span {
    box-shadow: -1px 1px 3px ${(props) => props.$color};
  }
  .icon .text {
    position: absolute;
    left: 50%;
    bottom: -5px;
    opacity: 0;
    font-weight: 500;
    font-size: 13px;
    white-space: nowrap;
    transform: translateX(-50%);
    transition:
      bottom 0.3s ease,
      opacity 0.3s ease;
  }
  .icon:hover .text {
    bottom: -22px;
    opacity: 1;
  }

  .icon:hover .layer span:nth-child(1) {
    opacity: 0.2;
  }
  .icon:hover .layer span:nth-child(2) {
    opacity: 0.4;
    transform: translate(5px, -5px);
  }
  .icon:hover .layer span:nth-child(3) {
    opacity: 0.6;
    transform: translate(10px, -10px);
  }
  .icon:hover .layer span:nth-child(4) {
    opacity: 0.8;
    transform: translate(15px, -15px);
  }
  .icon:hover .layer span:nth-child(5) {
    opacity: 1;
    transform: translate(20px, -20px);
  }

  .layer span.fab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.$iconBg};
    color: ${(props) => props.$color};
  }
  .layer span.fab-icon svg {
    width: 55%;
    height: 55%;
    fill: currentColor;
  }
  .user {
    display: flex;
    gap: 10px;
  }
  .img {
    width: 50px;
    height: 50px;
    font-size: 25px;
    font-weight: 700;
    border: 1px solid ${(props) => props.$color};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.$iconBg};
    color: ${(props) => props.$textPrimary};
  }
  .name {
    font-size: 17px;
    font-weight: 700;
    color: ${(props) => props.$color};
  }
  .username {
    color: ${(props) => props.$textMuted};
    font-size: 12px;
  }
  .details {
    display: flex;
    flex-direction: column;
    gap: 0;
    color: ${(props) => props.$textPrimary};
  }
  .about {
    color: ${(props) => props.$textMuted};
    padding-top: 5px;
  }
`;

export default ReusableSocialButton;
