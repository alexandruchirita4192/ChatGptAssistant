run_web: run_api
	cd ChatGptFrontEnd && ionic serve . &
run_api:
	bash -c "cd ChatGptBackend && source venv/bin/activate && python api.py" &

stop_api:
	killall python > /dev/null 2> /dev/null
stop_web:	stop_api
	killall ionic > /dev/null 2> /dev/null
stop_electron:	stop_api
	killall ChatGptAssistant	
stop_all:	stop_web	stop_electron

clean_electron_all:
	rm -rf ChatGptFrontEnd/ChatGptAssistant-*
build_electron_linux: clean_electron_all
	cd ChatGptFrontEnd && electron-packager . --platform=linux --overwrite
build_electron_win32: clean_electron_all
	cd ChatGptFrontEnd && electron-packager . --platform=win32 --overwrite
build_electron_all: clean_electron_all
	cd ChatGptFrontEnd && electron-packager . --platform=all --overwrite

run_electron_linux:	run_api build_electron_linux
	./ChatGptFrontEnd/ChatGptAssistant-linux-x64/ChatGptAssistant &

clean_api_venv:
	rm -rf ChatGptBackend/venv
recreate_api_venv:	clean_api_venv
	cd ChatGptBackend && python3 -m venv venv
	bash -c "cd ChatGptBackend && source venv/bin/activate && pip install -r requirements.txt"

clean_all:	clean_api_venv clean_electron_all
