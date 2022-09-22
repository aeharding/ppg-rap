import styled from "@emotion/styled/macro";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";
import { useAppSelector } from "../../hooks";
import {
  Alert,
  getAlertEnd,
  getAlertStart,
  getGroupedGAirmetAlertEnd,
  getGroupedGAirmetAlertStart,
  isGAirmetAlert,
} from "./alertsSlice";

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  > *:last-child {
    text-align: right;
  }
`;

interface TimesProps {
  alert: Alert;
  includeYear: boolean;
}

export default function Times({ alert, includeYear }: TimesProps) {
  const aviationAlertsResult = useAppSelector(
    (state) => state.weather.aviationAlerts
  );

  const aviationAlerts =
    typeof aviationAlertsResult === "object" ? aviationAlertsResult : [];

  const start = isGAirmetAlert(alert)
    ? new Date(getGroupedGAirmetAlertStart(alert, aviationAlerts))
    : new Date(getAlertStart(alert));

  const end = isGAirmetAlert(alert)
    ? getGroupedGAirmetAlertEnd(alert, aviationAlerts)
    : getAlertEnd(alert);

  return (
    <Container>
      <Time time={start} includeYear={includeYear}>
        Start
      </Time>
      <Time time={end ? new Date(end) : undefined} includeYear={includeYear}>
        End
      </Time>
    </Container>
  );
}

const Label = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.8em;
`;

const TimeLabel = styled.div`
  font-size: 1.3em;
  font-weight: 300;
`;

interface TimeProps {
  children: React.ReactNode;
  time?: Date;
  includeYear: boolean;
}

function Time({ children, time, includeYear }: TimeProps) {
  const timeZone = useAppSelector((state) => state.weather.timeZone);

  if (!timeZone) throw new Error("timezone must be defined");

  return (
    <div>
      <Label>{children}</Label>
      <TimeLabel>
        {time ? formatInTimeZone(time, timeZone, "p") : "Permanent"}
      </TimeLabel>
      {time ? (
        <div>
          {formatInTimeZone(
            time,
            timeZone,
            includeYear ? "eeee, MMMM do yyyy" : "eeee, MMMM do"
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
