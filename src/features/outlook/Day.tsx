import styled from "@emotion/styled";
import { formatInTimeZone } from "date-fns-tz";
import { useAppSelector } from "../../hooks";
import { timeZoneSelector } from "../weather/weatherSlice";

const Table = styled.table`
  width: 100%;

  padding: 0;
  border-collapse: collapse;
  border: none;
`;

const THead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--bg-bottom-sheet);
`;

const DayLabelCell = styled.th`
  text-align: start;
  padding: 8px 16px;
`;

interface DayProps {
  date: Date;
  hours: React.ReactNode[];
}

export default function Day({ hours, date }: DayProps) {
  const timeZone = useAppSelector(timeZoneSelector);
  if (!timeZone) throw new Error("timeZone needed");

  return (
    <Table>
      <THead>
        <tr>
          <DayLabelCell colSpan={5}>
            {formatInTimeZone(date, timeZone, "eeee, LLL d")}
          </DayLabelCell>
        </tr>
      </THead>
      {hours}
    </Table>
  );
}