<script lang="ts">
    export let progressValue = 0;
</script>

<app-progressbar>
    <div class=" container app-progressbar pt-5">
        <div class="progress-bar">
            <progress value={progressValue < 0 ? 0 : progressValue} max="100"> </progress>
        </div>
        <span class="badge" style=" left:{Math.round(progressValue < 0 ? 0 : progressValue)}%;  ">
            {Math.round(progressValue < 0 ? 0 : progressValue)}%
        </span>
    </div>
</app-progressbar>

<style>
    .container.app-progressbar {
        width: var(--pg-app-width, 100%);
        height: var(--pg-app-height, auto);

        padding-right: var(--pg-app-pr, 15px);
        padding-left: var(--pg-app-pl, 15px);
        padding-top: var(--pg-app-pt, 15px);
        padding-bottom: var(--pg-app-pb, 0px);

        margin-right: var(--pg-app-margin-right, auto);
        margin-left: var(--pg-app-margin-left, auto);
        margin-top: var(--pg-app-margin-top, auto);
        margin-bottom: var(--pg-app-margin-bottom, auto);

        background-color: var(--pg-app-bg-color, transparent);

        border-top: var(--pg-app-border-t, 1px);
        border-left: var(--pg-app-border-l, 1px);
        border-bottom: var(--pg-app-border-b, 1px);
        border-right: var(--pg-app-border-r, 1px);

        border-style: var(--pg-app-border-style, solid);
        border-color: var(--pg-app-border-color, transparent);
    }

    progress {
        height: var(--pg-height, 7px);
        width: var(--pg-width, 100%);
    }

    progress::-webkit-progress-value {
        background-color: var(--pg-value-bg-color, #005eb8);
        color: var(--pg-value-color, transparent);

        border-radius: var(--pg-value-border-radius, 1rem);
        transition: var(--pg-value-transition, width 0.5s ease-in-out);
        height: var(--pg-value-height, 7px);

        border-top: var(--pg-value-border-t, 0px);
        border-left: var(--pg-value-border-l, 0px);
        border-bottom: var(--pg-value-border-b, 0px);
        border-right: var(--pg-value-border-r, 0px);

        border-style: var(--pg-value-border-style, solid);
        border-color: var(--pg-value-border-color, transparent);
    }
    progress::-webkit-progress-bar {
        background-color: var(--pg-bar-bg-color, #9bcaeb);
        color: var(--pg-bar-color, transparent);

        height: var(--pg-bar-height, 7px);
        width: var(--pg-bar-width, 100%);

        border-top: var(--pg-bar-border-t, 0px);
        border-left: var(--pg-bar-border-l, 0px);
        border-bottom: var(--pg-bar-border-b, 0px);
        border-right: var(--pg-bar-border-r, 0px);

        border-style: var(--pg-bar-border-style, solid);
        border-color: var(--pg-bar-border-color, transparent);
        border-radius: var(--pg-bar-border-radius, 1rem);
    }

    .badge {
        background-color: var(--pg-badge-bg-color, #005eb8);
        color: var(--pg-badge-color, #fff);

        text-transform: var(--pg-badge-text-transform, uppercase);
        display: var(--pg-badge-display, inline-block);

        font-size: var(--pg-badge-font-size, 16px);
        font-style: var(--pg-badge-font-style, normal);
        font-weight: var(--pg-badge-font-weight, 500);
        line-height: var(--pg-badge-line-height, 1);
        text-align: var(--pg-badge-text-align, center);

        white-space: var(--pg-badge-white-space, nowrap);
        vertical-align: var(--pg-badge-vertical-align, baseline);

        position: var(--pg-badge-position, relative);
        top: var(--pg-badge-top, 5px);
        margin-left: var(--pg-badge-margin-left, -25px);

        width: var(--pg-badge-width, auto);
        height: var(--pg-badge-width, auto);

        padding-top: var(--pg-badge-pt, 0.38em);
        padding-right: var(--pg-badge-pr, 0.86em);
        padding-bottom: var(--pg-badge-pb, 0.38em);
        padding-left: var(--pg-badge-pl, 0.86em);

        border-top: var(--pg-badge-border-t, 1px);
        border-left: var(--pg-badge-border-l, 1px);
        border-bottom: var(--pg-badge-border-b, 1px);
        border-right: var(--pg-badge-border-r, 1px);

        border-style: var(--pg-badge-border-style, solid);
        border-color: var(--pg-badge-border-color, #ccc);
        border-radius: var(--pg-badge-border-radius, 0.25rem);
        border: var(--pg-badge-border, none);
    }

    .badge:hover {
        color: var(--pg-badge-hover-color, #fff);
        background-color: var(--pg-badge-hover-bg-color, #00519f);

        text-decoration: var(--pg-badge-hover-text-decoration, none);
        font-style: var(--pg-badge-hover-font-style, normal);

        cursor: var(--pg-badge-hover-cursor, pointer);

        border-top: var(--pg-badge-hover-border-t, 1px);
        border-left: var(--pg-badge-hover-border-l, 1px);
        border-bottom: var(--pg-badge-hover-border-b, 1px);
        border-right: var(--pg-badge-hover-border-r, 1px);

        border-style: var(--pg-badge-hover-border-style, solid);
        border-color: var(--pg-badge-hover-border-color, #ccc);
        border-radius: var(--pg-badge-hover-border-radius, 0.25rem);
        border: var(--pg-badge-hover-border, none);
    }
</style>
