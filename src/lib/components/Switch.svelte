<script lang="ts">
    export let label;
    export let fontSize = 16;
    export let value: boolean;
    export let toggle: (newValue: boolean) => void = () => {};
    export let disabled = false;

    const uniqueID = Math.floor(Math.random() * 100);

    /**
     * @param {{ target: any; }} event
     */
    function handleClick(event: { target: any }) {
        if (disabled) return;
        const target = event.target;

        const state = target.getAttribute('aria-checked');
        toggle(!value);
        if (!disabled) {
            value = state === 'true' ? false : true;
        }
    }
</script>

<div class="s switch" style="font-size:{fontSize}px">
    <button
        role="switch"
        aria-checked={value}
        aria-labelledby={`switch-${uniqueID}`}
        on:click={handleClick}
        aria-disabled={disabled}
        {disabled}
    >
    </button>
    <span id={`switch-${uniqueID}`}>{label}</span>
</div>

<style>
    .switch {
        display: flex;
        align-items: center;
    }

    .switch button {
        width: 3em;
        height: 1.6em;
        position: relative;
        margin: 0 5px 0 2px;
        border: none;
    }

    .switch button::before {
        content: '';
        position: absolute;
        width: 1.1em;
        height: 1.1em;
        background: var(--switch-checked-false-btn-color, #1a1a1a);
        top: 0.13em;
        right: 1.5em;
        transition: transform 0.3s;
    }
    .switch button[aria-checked='true']::before {
        background-color: var(--switch-checked-true-btn-color, #ffffff);
        margin-top: 1.8px;
    }

    .switch button[aria-checked='true'] {
        background-color: var(--switch-checked-bg-true-color, #0c66e1);
    }
    .switch button[aria-checked='false'] {
        background-color: var(--switch-checked-false-bg-color, #ffffff);
        border: 1.8px solid var(--switch-checked-false-border-color, #1a1a1a);
    }
    .switch button[aria-checked='false']::before {
        margin-top: 0.8px;
    }

    .switch button[aria-checked='true']::before {
        transform: translateX(1.3em);
        transition: transform 0.3s;
    }

    .switch button {
        border-radius: 1.5em;
    }

    .switch button::before {
        border-radius: 100%;
    }

    .switch button[aria-checked='true']:focus {
        box-shadow:
            0 0 0 2px #ffffff,
            0 0 0 4px var(--switch-checked-true-box-shadow-color, #0c66e1);
        outline: none;
    }

    .switch button[aria-checked='false']:focus {
        box-shadow:
            0 0 0 2px #ffffff,
            0 0 0 4px var(--switch-checked-false-box-shadow-color, #808080);
        outline: none;
    }

    .switch :disabled {
        cursor: not-allowed;
        opacity: 1;
    }
    .switch :disabled::before {
        background-color: #b3b3b3;
    }
    .switch :disabled[aria-checked='true']::before {
        background-color: #b3b3b3;
        border: 0;
        margin-top: 1px;
    }
    .switch :disabled[aria-checked='true'] {
        background-color: #e6e6e6;
        border: 1.8px solid #cccccc;
    }
    .switch :disabled[aria-checked='false'] {
        background-color: #ffffff;
        border: 1.8px solid #cccccc;
    }
    .switch :disabled[aria-checked='false']::before {
        border: 0;
    }
</style>
