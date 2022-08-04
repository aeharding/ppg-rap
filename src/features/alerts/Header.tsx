import styled from "@emotion/styled/macro";
import {
  faExclamationTriangle,
  faExternalLink,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { isAlertDangerous } from "../../helpers/weather";
import { Feature } from "../weather/weatherSlice";
import Times from "./Times";

const Container = styled.div<{ warning: boolean }>`
  padding: 1rem;
  background: ${({ warning }) => (warning ? "#6e0101" : "#6e6701")};
`;

const WarningIcon = styled(FontAwesomeIcon)`
  font-size: 1.3rem;
`;

const Headline = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Name = styled.div`
  font-size: 1.2rem;
  margin-left: 0.75rem;
  font-weight: 300;
`;

const Link = styled.a`
  display: flex;

  &:hover {
    text-decoration: none;
  }
`;

const OpenIcon = styled(FontAwesomeIcon)`
  font-size: 0.7em;
  opacity: 0.8;
  margin-top: 5px;
  margin-left: 0.5rem;
`;

const Aside = styled.div`
  margin-left: auto;
  font-size: 0.8em;
  padding: 2px 4px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;
`;

interface HeaderProps {
  alert: Feature;
  aside: React.ReactNode;
}

export default function Header({ alert, aside }: HeaderProps) {
  const awips = alert.properties.parameters.AWIPSidentifier[0];

  const product = awips.substring(0, 3);
  const site = awips.substring(3);

  return (
    <Container warning={isAlertDangerous(alert)}>
      <Headline>
        <WarningIcon icon={faExclamationTriangle} />{" "}
        <Link
          href={`https://forecast.weather.gov/product.php?site=${site}&product=${product}&issuedby=${site}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Name>{alert.properties.event}</Name>{" "}
          <OpenIcon icon={faExternalLink} />
        </Link>
        <Aside>{aside}</Aside>
      </Headline>

      <Times alert={alert} />
    </Container>
  );
}
