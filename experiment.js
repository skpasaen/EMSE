let SEED = "666";
Nof1.SET_SEED(SEED);
const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";
const STR_LEN = 150;

function makeRandomString(len = STR_LEN) {
    let s = "";
    for (let i = 0; i < len; i++) {
        const idx = Nof1.new_random_integer(CHARSET.length);
        s += CHARSET[idx];
    }
    return s;
}

// 1 = none, 2 = underline, 3 = blue
function expectedKeyFor(styleOrNone) {
    if (styleOrNone === "underline") return "2";
    if (styleOrNone === "blue") return "3";
    return "1"; // none
}

let experiment_configuration_function = (writer) => { return {

    experiment_name: "TestExperiment",
    seed: SEED,


    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "Bitte Vollbild aktivieren (F11). Im Task: [1] = kein Highlight, [2] = unterstrichen, [3] = blau."
        ),
    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string("Training beginnt.")
    ),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string("Experiment beginnt.\n\n")
    ),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Fast fertig. Die Daten werden nun heruntergeladen. Bitte Datei zurücksenden. Danke!"
            )
        )
    ],

    layout: [
        { variable: "Style", treatments: ["none", "underline", "blue"] },
        {variable: "MarkedLength", treatments: [1, 3, 5]}
    ],

    repetitions: 5,

    measurement: Nof1.Reaction_time(Nof1.keys(["1","2","3"])),

    task_configuration: (task) => {

        task.do_print_task = () => {
            writer.clear_stage();


            const style    = task.treatment_combination.treatment_combination[0].value; // "none"|"underline"|"blue"
            const markedLength = parseInt(task.treatment_combination.treatment_combination[1].value); // 1|2|3

            const text = makeRandomString();

            let hlIndex = 0;
            if (style !== "none") {
                const maxStart = STR_LEN - markedLength; // inklusiv
                hlIndex = Nof1.new_random_integer(maxStart + 1);
            }

            const spans = [];
            for (let i = 0; i < text.length; i++) {
                const ch = text[i];

                if (style !== "none" && i >= hlIndex && i < hlIndex + markedLength) {
                    const cls = (style === "underline") ? "hl-underline" : "hl-blue";
                    spans.push(`<span class="${cls}">${ch}</span>`);
                } else {
                    spans.push(`<span>${ch}</span>`);
                }
            }

            writer.print_html_on_stage(`
            <div style="font-family:sans-serif;font-size:100%;">${spans.join("")}</div>
            <div style="margin-top:12px;font-size:90%;">
                [1] kein Highlight &nbsp; | &nbsp;
                [2] <u>unterstrichen</u> &nbsp; | &nbsp;
                [3] <span style="color:blue;">blau</span>
            </div>
        `);


            task.expected_answer = expectedKeyFor(style);


            task.current_style     = style;
            task.current_markedLength  = markedLength;
            task.current_hlIndex       = hlIndex;
            task.current_text          = text;
        };

        // 1/2/3 sind gültige Antworten
        task.accepts_answer_function = (answer) =>
            (answer === "1" || answer === "2" || answer === "3");

        task.do_print_error_message = () => {
            writer.print_error_string_on_stage(
                writer.convert_string_to_html_string("Falsch. Bitte probiere eine andere Taste."));
        };

        task.do_print_after_task_information = () => {
            writer.clear_stage();
            writer.print_html_on_stage(
                writer.convert_string_to_html_string("Richtig. [Enter] für den nächsten Durchgang."));
        };
    }

}};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
