import React from "react";
import Section from "@ui/components/section";
import { useConfig } from "@ui/contexts/config";
import { SectionProps } from "@ui/types";
import Column from "@ui/components/column";
import Input from "@ui/components/input";
import Field, { withFieldContext } from "@ui/components/field";
import TextArea from "@ui/components/textarea";
import { useResult } from "@ui/hooks/use-result";
import { ScopeRequest, ScopeResult } from "@common/types";
import { MessageBroker } from "@common/messages";
import FieldGroup from "@ui/components/field-group";
import { Config, Unit } from "@common/config";
import RadioGroup from "@ui/components/radio-group";
import withController from "@ui/hocs/with-controller";
import { useForm } from "react-hook-form";
import { formatKebabCase, isBlank } from "@common/formatters";

export default function ConfigSection({ className, broker }: SectionProps) {
  const { control, onChange } = useConfigForm();
  const { scopes, isLoading } = useScopes(broker);

  return (
    <Section className={className} direction="row">
      <Column>
        <Field
          label="Root selector"
          description={
            "Figma's default mode values are applied to this CSS selector. If \
            left empty, you need to define explicitely the mode's class."
          }>
          <FieldInput name="rootSelector" control={control} onBlur={onChange} />
        </Field>
        <Field
          label="Base font size (px)"
          description={
            "Numbers are converted from px to em or rem based on the base font \
            size. 1rem = 1px / baseFontSize."
          }>
          <FieldInput
            type="number"
            name="baseFontSize"
            control={control}
            onBlur={onChange}
          />
        </Field>
        <Field
          className="grow"
          label="Trim keywords"
          description={
            "Keywords are trimmed from Tailwind classes. This prevents having \
            classes like bg-color-red or rounded-radius-sm. Keywords must \
            respect kebab-case."
          }>
          <FieldTextArea
            className="grow"
            name="trimKeywords"
            control={control}
            onBlur={onChange}
          />
        </Field>
      </Column>
      <Column>
        <FieldGroup
          label="Units"
          description={
            "Numbers are converted to units (px, em or rem) based on their \
            scopes. When multiple scopes are applied to a number variable, \
            they should have the same unit configuration."
          }
          emptyWarning={
            isLoading
              ? undefined
              : "Define number variables to configure units."
          }>
          {scopes.has("all-numbers") ? (
            <Field label="All number scopes" labelSize="small">
              <FieldRadioGroup
                name="allNumbers"
                control={control}
                choices={units}
                onChange={onChange}
              />
            </Field>
          ) : null}
          {scopes.has("radius") ? (
            <Field label="Corner radius" labelSize="small">
              <FieldRadioGroup
                name="radius"
                control={control}
                choices={units}
                onChange={onChange}
              />
            </Field>
          ) : null}
          {scopes.has("size") ? (
            <Field label="Width and height" labelSize="small">
              <FieldRadioGroup
                name="size"
                control={control}
                choices={units}
                onChange={onChange}
              />
            </Field>
          ) : null}
          {scopes.has("gap") ? (
            <Field label="Gap (auto layout)" labelSize="small">
              <FieldRadioGroup
                name="gap"
                control={control}
                choices={units}
                onChange={onChange}
              />
            </Field>
          ) : null}
          {scopes.has("stroke-width") ? (
            <Field label="Stroke" labelSize="small">
              <FieldRadioGroup
                name="strokeWidth"
                control={control}
                choices={units}
                onChange={onChange}
              />
            </Field>
          ) : null}
          {scopes.has("font-size") ? (
            <Field label="Font size" labelSize="small">
              <FieldRadioGroup
                name="fontSize"
                control={control}
                choices={units}
                onChange={onChange}
              />
            </Field>
          ) : null}
          {scopes.has("line-height") ? (
            <Field label="Line height" labelSize="small">
              <FieldRadioGroup
                name="lineHeight"
                control={control}
                choices={units}
                onChange={onChange}
              />
            </Field>
          ) : null}
          {scopes.has("letter-spacing") ? (
            <Field label="Letter spacing" labelSize="small">
              <FieldRadioGroup
                name="letterSpacing"
                control={control}
                choices={units}
                onChange={onChange}
              />
            </Field>
          ) : null}
        </FieldGroup>
      </Column>
    </Section>
  );
}

function useScopes(broker: MessageBroker) {
  const { result, isLoading } = useResult<ScopeRequest, ScopeResult>(
    broker,
    "SCOPE_RESULT",
    "SCOPE_REQUEST",
  );

  return { scopes: new Set(result || []), isLoading };
}

function useConfigForm() {
  const { config, setConfig } = useConfig();
  const { control, handleSubmit } = useForm({
    values: toFormState(config),
  });

  const onChange = handleSubmit(values =>
    setConfig({
      ...config,
      rootSelector: values.rootSelector,
      baseFontSize: values.baseFontSize,
      trimKeywords: toTrimKeywords(values.trimKeywords),
      units: {
        ...config.units,
        "all-numbers": values.allNumbers,
        radius: values.radius,
        size: values.size,
        gap: values.gap,
        "stroke-width": values.strokeWidth,
        "font-size": values.fontSize,
        "line-height": values.lineHeight,
        "letter-spacing": values.letterSpacing,
      },
    }),
  );

  return { control, onChange };
}

function toFormState(config: Config) {
  return {
    rootSelector: config.rootSelector,
    baseFontSize: config.baseFontSize,
    trimKeywords: config.trimKeywords.join(", "),
    allNumbers: config.units["all-numbers"],
    radius: config.units["radius"],
    size: config.units["size"],
    gap: config.units["gap"],
    strokeWidth: config.units["stroke-width"],
    fontSize: config.units["font-size"],
    lineHeight: config.units["line-height"],
    letterSpacing: config.units["letter-spacing"],
  };
}

function toTrimKeywords(value: string | undefined): string[] {
  if (isBlank(value)) return [];

  const keywords = value.split(",");
  return keywords.map(formatKebabCase);
}

const units = ["px", "rem", "em"] satisfies Unit[];

const FieldInput = withController(withFieldContext(Input));
const FieldTextArea = withController(withFieldContext(TextArea));
const FieldRadioGroup = withController(withFieldContext(RadioGroup));
