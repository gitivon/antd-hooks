import { useCallback } from "react"
import { WrappedFormUtils } from "antd/lib/form/Form";

const useSubmit = <TOwnFormProps = any>(form: WrappedFormUtils<TOwnFormProps>, cb: (values: TOwnFormProps) => any) => {
  return useCallback((e: React.FormEvent<any>) => {
    e.preventDefault();
    form.validateFields((errors, values) => {
      !errors && cb(values);
    })
  }, [form, cb]);
}

export default useSubmit;