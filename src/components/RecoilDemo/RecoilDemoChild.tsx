import { Container } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useRecoilState } from "recoil";
import demoState from "../../states/demo.state";

function useRecoilDemoChild() {
  const [recoilState, setRecoildState] = useRecoilState(demoState);

  function toggle() {
    setRecoildState(!recoilState);
  }

  return {
    recoilState,
    toggle,
  };
}

export default function RecoilDemoChild({ children }: any) {
  const { recoilState, toggle } = useRecoilDemoChild();

  return (
    <Container>
      <label>Toggle value: <b className="text-primary mx-2">{recoilState.toString()}</b></label>
      <FormCheckInput checked={recoilState} onClick={() => toggle()} />
      {children}
    </Container>
  );
}
