<template>
  <div class="mdc-demo mdc-demo--container">
    <div class="linear-progress-demo">
      <mdc-linear-progress progress="0.5"/>
      <p>
        <mdc-caption>Determinate</mdc-caption>
      </p>
      <br>
      <mdc-linear-progress indeterminate/>
      <p>
        <mdc-caption>Indeterminate</mdc-caption>
      </p>
      <br>
      <mdc-linear-progress progress="0.5" buffer="0.75"/>
      <p>
        <mdc-caption>Buffer</mdc-caption>
      </p>
      <br>
    </div>
  </div>
</template>

<style>
.linear-progress-demo {
  flex: 1;
  min-width: 150px;
  max-width: 450px;
}
</style>
