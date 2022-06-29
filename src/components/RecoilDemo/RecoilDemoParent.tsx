import { useEffect } from "react";
import { Container, Stack } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import demoState from "../../states/demo.state";
import RecoilDemoChild from "./RecoilDemoChild";

function useRecoilDemoParent() {
  const setRecoildState = useSetRecoilState(demoState);

  useEffect(() => {
    setRecoildState(true);
  }, [setRecoildState]);
}

export default function RecoilDemoParent() {
  useRecoilDemoParent();
  const [recoilState, toggle] = useRecoilState(demoState);

  return (
    <Container>
      <Stack gap={2}>
        <div>
          <h3>Recoil Root Demo:</h3>
          <Container className="border border-secondary">
            <b>Parent:</b>
            <div>
              <label>
                Toggle value:
                <b className="text-primary mx-2">{recoilState.toString()}</b>
              </label>
              <FormCheckInput
                checked={recoilState}
                onClick={() => toggle(!recoilState)}
              />
            </div>
          </Container>
        </div>
        <Stack direction="horizontal" gap={2}>
          <Container className="border border-primary">
            <b>Child 1:</b>
            <RecoilRoot>
              <RecoilDemoChild />
            </RecoilRoot>
          </Container>
          <Container className="border border-success">
            <b>Child 2:</b>
            <RecoilDemoChild>
              <Container className="border border-danger">
                <b>Child 2's child:</b>
                <>
                  <RecoilDemoChild />
                </>
              </Container>
            </RecoilDemoChild>
          </Container>
        </Stack>
      </Stack>
    </Container>
  );
}
