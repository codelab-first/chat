import { useState, useEffect, useCallback, use } from "react";
import useKakaoApi from "../components/api/useKakaoApi";
import { api } from "../modules/api";

interface LocationState {
  position : { lat: number; lng: number };
  address: string;
  region: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const DEFAULT_POSITION = {
  lat: import.meta.env.VITE_DEFAULT_LATITUDE,
  lng: import.meta.env.VITE_DEFAULT_LONGITUDE,
}

export default function useCurrentLocation(): LocationState {
  const { loading: apiLoading, error: apiError } = useKakaoApi();
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [address, setAddress] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);

  const fetchLocation = useCallback(() => {
    if (apiLoading) {
      setLoading(false);
      setError("카카오맵 API 로딩 중...");
      return;
    }
    if (apiError) {
      console.error("카카오맵 로딩 실패", apiError);
      setLoading(false);
      setError("카카오맵 로딩에 실패했습니다.");
      return;
    }

    if (!navigator.geolocation) {
      setLoading(false);
      setError("사용자의 위치 정보를 가져올 수 없습니다. 기본 위치로 설정됩니다.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("현재 위치 좌표:", latitude, longitude);

        setPosition({ lat: latitude, lng: longitude });

        if (window.kakao && window.kakao.maps.services) {
          const geocoder = new (window as any).kakao.maps.services.Geocoder(); // window.kakao 타입 캐스팅
          geocoder.coord2Address(longitude, latitude, (result: any, status: any) => {
            if (status === (window as any).kakao.maps.services.Status.OK) {
              const region = result[0].address;
              if (region) {
                setAddress(region.address_name);
                const { region_1depth_name: city, region_2depth_name: district, region_3depth_name: town } = region;
                const regionAddress = `${city} ${district} ${town}`;
                setRegion(regionAddress);
              } else {
                setError("주소를 찾지 못했습니다.");
              }
            } else {
              setError("주소 변환에 실패했습니다.");
            }
            setLoading(false);
          });
        } else {
          setError("카카오맵 API가 로드되지 않았습니다.");
          setLoading(false);
        }
      },
      (err) => {
        setError("위치 정보를 가져올 수 없습니다: " + err.message);
        setLoading(false);
      }
    );
  }, [apiLoading, apiError]);

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation, fetchTrigger]);

  return { position, address, region, loading, error, refetch };
}