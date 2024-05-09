import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfigProvider, Select, Spin } from "antd";
import debounce from "lodash/debounce";

export const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, initialValue = [], onChange, ...props }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(initialValue);
  const fetchRef = useRef(0);

  useEffect(() => {
    setValue(initialValue);
  }, []);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <ConfigProvider
    theme={{
      components: {
      Select: {
        optionSelectedBg: '#00000011',
      },
      },
    }}
    >
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          onChange(newValue);
        }}
        options={options}
      />
    </ConfigProvider>
  );
}
