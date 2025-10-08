declare module "react-dom" {
  type FormAction<State, Payload> = (state: State, payload: Payload) => State | Promise<State>;

  export function useFormState<State, Payload = FormData>(
    action: FormAction<State, Payload>,
    initialState: State,
  ): [State, (payload: Payload) => void];

  export function useFormStatus(): { pending: boolean };
}
