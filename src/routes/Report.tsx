import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getRap, clear as clearRap } from "../features/rap/rapSlice";
import Hours from "../features/rap/Hours";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loading from "../shared/Loading";
import { getTrimmedCoordinates, isLatLonTrimmed } from "../helpers/coordinates";
import Error from "../shared/Error";
import { ReactComponent as Map } from "../assets/map.svg";
import { ReactComponent as ErrorSvg } from "../assets/error.svg";
import NotFound from "./NotFound";
import {
  getWeather,
  clear as clearWeather,
  timeZoneSelector,
} from "../features/weather/weatherSlice";
import { differenceInHours, isPast } from "date-fns";
import { getTFRs, clear as clearFaa } from "../features/faa/faaSlice";

export default function Report() {
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");

  if (!lat || !lon || isNaN(+lat) || isNaN(+lon)) return <NotFound />;

  return <ValidParamsReport lat={lat} lon={lon} />;
}

interface ValidParamsReportProps {
  lat: string;
  lon: string;
}

function ValidParamsReport({ lat, lon }: ValidParamsReportProps) {
  const dispatch = useAppDispatch();
  const rap = useAppSelector((state) => state.rap.rap);
  const timeZone = useAppSelector(timeZoneSelector);
  const timeZoneLoading = useAppSelector(
    (state) => state.weather.timeZoneLoading
  );
  const elevationLoading = useAppSelector(
    (state) => state.weather.elevationLoading
  );
  const elevation = useAppSelector((state) => state.weather.elevation);

  useEffect(() => {
    if (!isLatLonTrimmed(lat, lon)) return;

    dispatch(getRap(+lat, +lon));
    dispatch(getWeather(+lat, +lon));
    dispatch(getTFRs(+lat, +lon));

    return () => {
      dispatch(clearWeather());
      dispatch(clearRap());
      dispatch(clearFaa());
    };
  }, [dispatch, lat, lon]);

  const connectionError = (
    <Error
      icon={ErrorSvg}
      title="Connection error"
      description="Please check your internet connection, and try again later if this error remains."
    />
  );

  if (!isLatLonTrimmed(lat, lon)) {
    return <Navigate to={`/${getTrimmedCoordinates(+lat, +lon)}`} replace />;
  }

  if (timeZoneLoading || elevationLoading) return <Loading />;

  switch (rap) {
    case "pending":
    case undefined:
      return <Loading />;
    case "failed":
      return connectionError;
    case "coordinates-error":
      return (
        <Error
          icon={Map}
          title="That's an unknown place."
          description="At this time, only United States locations are supported."
        />
      );
    default:
      if (!timeZone || elevation == null) return connectionError;

      if (rap.filter(({ date }) => !isPast(new Date(date))).length < 4)
        return connectionError;

      return (
        <Hours
          rap={rap.filter(
            ({ date }) =>
              !(
                isPast(new Date(date)) &&
                differenceInHours(new Date(), new Date(date)) >= 4
              )
          )}
        />
      );
  }
}
